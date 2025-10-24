use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub enum GiftStatus {
    #[default]
    PENDING,
    PURCHASED,
    REDEEMED,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Gift {
    pub token_id: u256,
    pub minter: ContractAddress,
    pub token_contract: ContractAddress,
    pub token_amount: u256,
    pub status: GiftStatus,
    pub category_id: u64,
}
