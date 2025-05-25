"use client";
import { GiftCardGrid } from "@/components/gift-card-grid"
import { useAccount } from "@starknet-react/core"
import { useEffect, useState } from "react"
import { GiftCard } from "@/types/gift-card"
import { giftCards } from "@/lib/samples"
import { useNiftReadContract } from "@/hooks/useNiftContractRead"

export default function MyGiftsPage() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setGiftCards] = useState<GiftCard[]>([])
  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Gift Cards</h1>
        <p className="text-muted-foreground">View and manage your NFT gift cards.</p>
      </div>
      <GiftCardGrid giftCards={giftCards} isLoading={isLoading} />
    </div>
  )
}
