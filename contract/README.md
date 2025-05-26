# NIFT Smart Contract

A StarkNet-based NFT gift card system that allows users to purchase, transfer, and redeem cryptocurrency gift cards as ERC-721 tokens.

## Overview

The NIFT contract enables users to:
- Purchase gift cards by depositing ERC-20 tokens
- Receive NFT gift cards as proof of ownership
- Transfer gift cards to other users
- Redeem gift cards to receive the underlying tokens
- Earn loyalty points through purchases

## Features

### Core Functionality
- **ERC-721 Compliant**: Full NFT standard implementation with enumerable extension
- **Multi-Token Support**: Accept any ERC-20 token for gift card purchases
- **Secure Redemption**: Only gift card owners can redeem their tokens
- **Points System**: Users earn points for purchases (loyalty program ready)
- **Event Tracking**: Comprehensive event logging for all major actions

### Security Features
- **Ownable Access Control**: Owner-only functions for administrative tasks
- **Balance Validation**: Ensures users have sufficient tokens before purchase
- **Gift Card Status Tracking**: Prevents double-redemption attacks
- **Caller Validation**: Zero-address protection

## Contract Architecture

### Components Used
- `OwnableComponent`: Access control for administrative functions
- `ERC721Component`: Core NFT functionality
- `ERC721EnumerableComponent`: Token enumeration and owner tracking
- `SRC5Component`: Interface detection support

### Storage Structure
```cairo
struct Storage {
    gifts: Map<u256, Gift>,                    // token_id => Gift details
    user_purchased_gifts: Map<ContractAddress, Vec<u256>>, // user => token_ids
    user_points: Map<ContractAddress, u256>,   // user => loyalty points
    id_pointer: u256,                          // next available token ID
}
```

### Gift Card Structure
```cairo
struct Gift {
    token_id: u256,           // Unique NFT identifier
    token_contract: ContractAddress, // ERC-20 token address
    token_amount: u256,       // Amount of tokens
    minter: ContractAddress,  // Original purchaser
    status: GiftStatus,       // PENDING, PURCHASED or REDEEMED
}
```

## Main Functions

### Purchase Gift Card
```cairo
fn purchase_gift_card(token: ContractAddress, amount: u256) -> Gift
```
- Validates user's token balance
- Transfers tokens to contract
- Mints NFT gift card
- Awards loyalty points
- Emits `GiftPurchased` event

### Redeem Gift Card
```cairo
fn redeem_gift_card(token_id: u256)
```
- Validates ownership and availability
- Transfers underlying tokens to redeemer
- Burns the NFT gift card
- Updates gift status
- Emits `GiftRedeemed` event

### Query Functions
- `get_gift_card_info(token_id)`: Retrieve gift card details
- `get_all_user_gifts(user)`: Get all NFTs owned by user
- `get_user_purchased_gifts(user)`: Get all gifts originally purchased by user
- `get_user_points(user)`: Get user's loyalty points balance
- `is_gift_card_available(token_id)`: Check if gift card can be redeemed

## Events

### GiftPurchased
```cairo
struct GiftPurchased {
    token_id: u256,
    token_contract: ContractAddress,
    token_amount: u256,
    minter: ContractAddress,
    date_purchased: u64,
}
```

### GiftRedeemed
```cairo
struct GiftRedeemed {
    token_id: u256,
    token_contract: ContractAddress,
    token_amount: u256,
    user: ContractAddress,
    date_redeemed: u64,
}
```



## Security Considerations

1. **Reentrancy Protection**: Uses OpenZeppelin components with built-in protections
2. **Access Control**: Owner-only functions for administrative tasks
3. **Input Validation**: Comprehensive checks for all user inputs
4. **Balance Verification**: Ensures sufficient funds before operations
5. **Status Tracking**: Prevents double-spending of gift cards

## Deployment

### Prerequisites
- StarkNet development environment
- Cairo compiler
- OpenZeppelin Cairo contracts
- Node and NPM

### Constructor Parameters
```cairo
fn constructor(owner: ContractAddress)
```
- `owner`: Address that will have administrative control

## Future Enhancements

### Planned Features
- **Dynamic Points Calculation**: Implement sophisticated loyalty point algorithm
- **Gift Card Marketplace**: Enable secondary trading
- **Multi-Currency Support**: Price feeds for fiat equivalents


## Testing

Comprehensive test coverage should include:
- Purchase flow with various tokens and amounts
- Transfer scenarios between different users
- Redemption by original purchaser and gift recipients
- Edge cases (zero amounts, invalid tokens, etc.)
- Access control verification
- Event emission validation

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Submit a pull request


**Note**: This contract is designed for StarkNet's Cairo language and requires Cairo-specific tooling for compilation and deployment.