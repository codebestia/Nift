#[starknet::contract]
pub mod Nift {
    // use OwnableComponent::InternalTrait;
    use core::num::traits::Zero;
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin_token::erc721::ERC721Component;
    use openzeppelin_token::erc721::extensions::ERC721EnumerableComponent;
    use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
    use starknet::storage::{
        Map, MutableVecTrait, StorageMapReadAccess, StorageMapWriteAccess, StoragePathEntry,
        StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait,
    };
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address, get_contract_address, get_block_number};
    use crate::interface::INift;
    use crate::types::{Gift, GiftStatus};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(
        path: ERC721EnumerableComponent, storage: erc721_enumerable, event: ERC721EnumerableEvent,
    );
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl ERC721EnumerableImpl =
        ERC721EnumerableComponent::ERC721EnumerableImpl<ContractState>;
    impl ERC721EnumerableInternalImpl = ERC721EnumerableComponent::InternalImpl<ContractState>;

    #[derive(Drop, starknet::Event)]
    pub struct GiftPurchased {
        token_id: u256,
        token_contract: ContractAddress,
        token_amount: u256,
        minter: ContractAddress,
        date_purchased: u64,
    }
    #[derive(Drop, starknet::Event)]
    pub struct GiftRedeemed {
        token_id: u256,
        token_contract: ContractAddress,
        token_amount: u256,
        user: ContractAddress,
        date_redeemed: u64,
    }


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GiftPurchased: GiftPurchased,
        GiftRedeemed: GiftRedeemed,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        ERC721EnumerableEvent: ERC721EnumerableComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }


    #[storage]
    struct Storage {
        gifts: Map<u256, Gift>, // token_id => Gift
        user_purchased_gifts: Map<ContractAddress, Vec<u256>>,
        user_points: Map<ContractAddress, u256>,
        id_pointer: u256,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        erc721_enumerable: ERC721EnumerableComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name = "Nift";
        let symbol = "NIFT";
        let base_uri = "https://api.example.com/v1/";

        self.erc721.initializer(name, symbol, base_uri);
        self.erc721_enumerable.initializer();
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl NiftImpl of INift<ContractState> {
        fn set_base_uri(ref self: ContractState, uri: ByteArray) {
            self.ownable.assert_only_owner();
            self.erc721._set_base_uri(uri);
        }
        fn purchase_gift_card(
            ref self: ContractState, token: ContractAddress, amount: u256,
        ) -> Gift {
            let minter = get_caller_address();
            // Check token balance
            self.assert_has_token_balance(token, amount, minter);
            // Initialize the Gift
            let token_id = self.id_pointer.read() + 1;
            let category_id = self.generate_category_id();
            let gift = Gift {
                token_id,
                token_contract: token,
                token_amount: amount,
                minter,
                status: GiftStatus::PURCHASED,
                category_id,
            };
            // Save new token_id
            self.id_pointer.write(token_id);
            // Add token_id to user purchased gifts
            self.user_purchased_gifts.entry(minter).push(token_id);

            // Calculate point and add it
            let points = self.calculate_points(token, amount, minter);
            self.add_to_user_points(minter, points);

            // Save the Gift Info
            self.gifts.entry(token_id).write(gift);

            // Transfer the token from the caller
            let nift_address = get_contract_address();
            let erc20_dipatcher = IERC20Dispatcher { contract_address: token };
            erc20_dipatcher.transfer_from(minter, nift_address, amount);
            // Mint Gift card
            self.erc721.mint(minter, token_id);
            // emit the gift purchased event
            let gift_event = GiftPurchased {
                token_id,
                token_contract: token,
                token_amount: amount,
                minter,
                date_purchased: get_block_timestamp(),
            };
            self.emit(gift_event);

            // Return the Gift instance
            gift
        }
        fn redeem_gift_card(ref self: ContractState, token_id: u256) {
            let caller = get_caller_address();
            // validate gift card
            self.assert_gift_is_available(token_id);
            // validate caller
            self.assert_non_zero_caller(caller);
            self.assert_is_gift_card_owner(token_id, caller);
            // update gift card
            let mut gift = self.gifts.read(token_id);
            gift.status = GiftStatus::REDEEMED;
            self.gifts.write(token_id, gift);
            // Transfer token to caller
            let erc20_dipatcher = IERC20Dispatcher { contract_address: gift.token_contract };
            erc20_dipatcher.transfer(caller, gift.token_amount);
            // Burn gift card
            self.erc721.burn(token_id);
            // emit the gift redeemed event
            let gift_event = GiftRedeemed {
                token_id,
                token_contract: gift.token_contract,
                token_amount: gift.token_amount,
                user: caller,
                date_redeemed: get_block_timestamp(),
            };
            self.emit(gift_event);
        }
        fn get_gift_card_info(self: @ContractState, token_id: u256) -> Gift {
            self.gifts.read(token_id)
        }
        fn get_all_user_gifts(self: @ContractState, user: ContractAddress) -> Span<u256> {
            self.erc721_enumerable.all_tokens_of_owner(user)
        }
        fn get_user_purchased_gifts(self: @ContractState, user: ContractAddress) -> Array<Gift> {
            let mut array_gifts: Array<Gift> = array![];
            let user_gifts = self.user_purchased_gifts.entry(user);
            for index in 0..user_gifts.len() {
                let token_id = user_gifts.at(index).read();
                let gift = self.gifts.read(token_id);
                array_gifts.append(gift);
            }
            array_gifts
        }
        fn get_user_points(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_points.read(user)
        }

        fn is_gift_card_available(self: @ContractState, token_id: u256) -> bool {
            let gift = self.gifts.read(token_id);
            gift.status == GiftStatus::PURCHASED
        }
    }

    impl ERC721HooksImpl of ERC721Component::ERC721HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC721Component::ComponentState<ContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress,
        ) {
            let mut contract_state = self.get_contract_mut();
            contract_state.erc721_enumerable.before_update(to, token_id);
        }
    }

    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn assert_gift_is_available(self: @ContractState, token_id: u256) {
            let gift = self.gifts.read(token_id);
            assert(gift.status == GiftStatus::PURCHASED, 'Gift card is not available');
        }
        fn assert_has_token_balance(
            self: @ContractState, token: ContractAddress, amount: u256, caller: ContractAddress,
        ) {
            let dispatcher = IERC20Dispatcher { contract_address: token };
            assert(dispatcher.balance_of(caller) >= amount, 'Insufficient token balance')
        }
        fn assert_is_gift_card_owner(
            self: @ContractState, token_id: u256, caller: ContractAddress,
        ) {
            let nift_address = get_contract_address();
            let erc721_dipatcher = IERC721Dispatcher { contract_address: nift_address };
            assert(erc721_dipatcher.owner_of(token_id) == caller, 'Not Gift owner')
        }
        fn assert_non_zero_caller(self: @ContractState, caller: ContractAddress) {
            assert(caller.is_non_zero(), 'Invalid Caller');
        }
        fn calculate_points(
            self: @ContractState, token: ContractAddress, amount: u256, user: ContractAddress,
        ) -> u256 {
            // generate a proper algorithm to calculate new point based
            // on the token, the amount of the token and its value in fiat,
            // and the activiy of the user
            10_u256
        }
        fn add_to_user_points(ref self: ContractState, user: ContractAddress, points: u256) {
            let prev_points = self.user_points.read(user);
            let new_points = prev_points + points;
            self.user_points.write(user, new_points);
        }
        fn generate_category_id(self: @ContractState) -> u64 {
            let timestamp = get_block_timestamp();
            let block_number = get_block_number();
            let category_id = timestamp  * block_number;
            category_id % 20 // limit to 20 categories
        }
    }
}
