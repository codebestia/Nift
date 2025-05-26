# NIFT - Web3 Gift Card System

A modern Web3 application that allows users to purchase, send, and redeem cryptocurrency gift cards as NFTs. 
Built with Next.js, TypeScript, and Tailwind CSS.
Built on the starknet blockchain.

## 🌟 UI Features

### Landing Page
- **Hero Section**: Eye-catching gradient design with compelling messaging
- **Features Section**: Highlights the benefits of blockchain-based gift cards
- **Newsletter Signup**: Stay updated with the latest features and offers
- **Responsive Design**: Optimized for all device sizes

### Wallet Integration
- **Connect Wallet**: Seamless wallet connection with loading states
- **Dashboard Access**: Automatic navigation to dashboard after wallet connection
- **Wallet Display**: Shows connected wallet address in the sidebar

### Dashboard
- **Analytics**: Comprehensive metrics including:
  - Total gifts purchased and redeemed
  - Total value in USD
  - Points earned
  - Interactive charts showing activity over time
- **My Gifts**: View and manage owned NFT gift cards
- **Purchase Gift Cards**: Create new gift cards with various cryptocurrencies
- **Redeem Gift Cards**: Convert gift cards back to cryptocurrency

### Gift Card Management
- **NFT Display**: Beautiful card-based UI showing gift card details
- **Send Functionality**: Transfer gift cards to other wallet addresses
- **Transaction Tracking**: View transactions on blockchain explorers
- **Loading States**: Skeleton loaders for better UX


## 🚧 Smart Contract Features

The NIFT contract enables users to:
- Purchase gift cards by depositing ERC-20 tokens
- Receive NFT gift cards as proof of ownership
- Transfer gift cards to other users
- Redeem gift cards to receive the underlying tokens
- Earn loyalty points through purchases

### Core Functionality
- **ERC-721 Compliant**: Full NFT standard implementation with enumerable extension
- **Multi-Token Support**: Accept any ERC-20 token for gift card purchases
- **Secure Redemption**: Only gift card owners can redeem their tokens
- **Points System**: Users earn points for purchases (loyalty program ready)
- **Event Tracking**: Comprehensive event logging for all major actions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks
- **Smart Contract**: Cairo
- **Core Contract Dependency**: Openzepplin

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Scarb
- Starknet foundry

### Installation

1. Clone the repository:
```bash
git clone https://github.com/codebestia/nift.git
cd nift
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.


## 🚧 Current Implementation Status

### ✅ Completed Features
- Landing page with hero, features, and newsletter sections
- Wallet connection simulation
- Dashboard with analytics, gift management, purchase, and redeem flows
- Gift card display with NFT-style cards
- Send gift functionality with modal flows
- Loading states and skeleton UI
- Responsive design


### 🎯 Integration
- Smart contract integration for Gift card purchase and redeem.
- Real wallet providers (Argent, Bravos)
- Blockchain transaction processing
- IPFS for NFT metadata storage (coming soon)
- Real-time price feeds

## 🔮 Future Enhancements

- **Multi-chain Support**: Support for multiple blockchains
- **NFT Image Generation**: Backend service for generating Nft image automatically after gift card purchase.
- **Advanced Analytics**: More detailed metrics and reporting
- **Social Features**: Gift card sharing and social media integration
- **Mobile App**: React Native implementation
- **Marketplace**: Secondary market for gift card trading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


**NIFT** - Revolutionizing digital gifting with blockchain technology 🎁
