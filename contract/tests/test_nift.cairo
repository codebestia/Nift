use nift::interface::{INiftDispatcher, INiftDispatcherTrait};
use openzeppelin_testing::declare_and_deploy;
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::{CheatSpan, cheat_caller_address, start_cheat_caller_address};
use starknet::{ContractAddress, contract_address_const};

fn OWNER() -> ContractAddress {
    contract_address_const::<0x07c7116d0f6756E6430952aa181dBD0320E3F91F62D5416E5776331B4B0b5076>()
}
const NIFT_CONTRACT_ADDRESS: felt252 =
    0x4a243d3e9febbe0bfd4c3fa425c5bacfb60c9008d42d84a477fa38d72a2ec4b;
const MOCK_TOKEN_CONTRACT_ADDRESS: felt252 =
    0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;


fn deploy_contract(name: ByteArray) -> ContractAddress {
    let mut calldata = array![];
    calldata.append_serde(OWNER());
    declare_and_deploy(name, calldata)
}

#[test]
#[fork("SEPOLIA_LATEST")]
fn test_purchase_gift_card() {
    let nift_contract_address = contract_address_const::<NIFT_CONTRACT_ADDRESS>();
    let mock_token_contract_address = contract_address_const::<MOCK_TOKEN_CONTRACT_ADDRESS>();
    let nift = INiftDispatcher { contract_address: nift_contract_address };
    let erc20 = IERC20Dispatcher { contract_address: mock_token_contract_address };

    let caller = OWNER();
    cheat_caller_address(mock_token_contract_address, caller, CheatSpan::TargetCalls(2));
    erc20.approve(nift_contract_address, 1000000000);
    cheat_caller_address(nift_contract_address, caller, CheatSpan::TargetCalls(1));
    let gift = nift.purchase_gift_card(mock_token_contract_address, 20000000);
    assert(gift.token_contract == mock_token_contract_address, 'invalid token');
    assert(gift.token_amount == 20000000, 'invalid amount');
}
