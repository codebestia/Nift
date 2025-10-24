use starknet::ContractAddress;
use crate::types::Gift;

#[starknet::interface]
pub trait INift<TContractState> {
    fn set_base_uri(ref self: TContractState, uri: ByteArray);
    fn purchase_gift_card(
        ref self: TContractState, token: ContractAddress, amount: u256, message: Option<ByteArray>,
    ) -> Gift;
    fn redeem_gift_card(ref self: TContractState, token_id: u256);
    fn get_gift_card_info(self: @TContractState, token_id: u256) -> Gift;
    fn get_all_user_gifts(self: @TContractState, user: ContractAddress) -> Span<u256>;
    fn get_user_purchased_gifts(self: @TContractState, user: ContractAddress) -> Array<Gift>;
    fn get_user_points(self: @TContractState, user: ContractAddress) -> u256;
    fn get_gift_message(self: @TContractState, token_id: u256) -> ByteArray;
    fn is_gift_card_available(self: @TContractState, token_id: u256) -> bool;
}
