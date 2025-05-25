import { RedeemGiftCards } from "@/components/redeem-gift-cards"

export default function RedeemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Redeem Gift Cards</h1>
        <p className="text-muted-foreground">Redeem your NFT gift cards to receive the cryptocurrency.</p>
      </div>
      <RedeemGiftCards />
    </div>
  )
}
