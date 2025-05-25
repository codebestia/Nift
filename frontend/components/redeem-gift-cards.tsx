"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink, Loader2 } from "lucide-react"

export function RedeemGiftCards() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null)

  // Sample NFT gift card data
  const giftCards: GiftCard[] = [
    {
      id: "1",
      image: "/placeholder.svg?height=300&width=300",
      name: "ETH Gift Card",
      token: "ETH",
      amount: 0.25,
      value: 750,
      tokenId: "#1234",
    },
    {
      id: "2",
      image: "/placeholder.svg?height=300&width=300",
      name: "BTC Gift Card",
      token: "BTC",
      amount: 0.01,
      value: 600,
      tokenId: "#5678",
    },
    {
      id: "3",
      image: "/placeholder.svg?height=300&width=300",
      name: "USDC Gift Card",
      token: "USDC",
      amount: 500,
      value: 500,
      tokenId: "#9101",
    },
  ]

  const handleRedeem = (card: GiftCard) => {
    setSelectedCard(card)
    setConfirmDialogOpen(true)
  }

  const handleConfirmRedeem = () => {
    setConfirmDialogOpen(false)
    setProcessingDialogOpen(true)

    // Simulate processing time
    setTimeout(() => {
      setProcessingDialogOpen(false)
      setCompleteDialogOpen(true)
    }, 5000)
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {giftCards.map((card) => (
          <Card
            key={card.id}
            className="overflow-hidden bg-gradient-to-br from-purple-950 to-slate-900 border border-purple-800/30 hover:border-purple-500/50 transition-all"
          >
            <CardHeader className="p-0">
              <div className="relative aspect-square bg-black/20">
                <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center justify-end">
                    <a
                      href={`https://etherscan.io/token/${card.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/70 hover:text-white flex items-center gap-1"
                    >
                      View on Explorer <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <CardTitle className="flex items-center justify-between">
                <span>{card.name}</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">{card.tokenId}</span>
              </CardTitle>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Token</span>
                  <span className="font-medium">{card.token}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Amount</span>
                  <span className="font-medium">
                    {card.amount} {card.token}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Value</span>
                  <span className="text-sm text-zinc-300">${card.value.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button onClick={() => handleRedeem(card)} className="w-full bg-purple-600 hover:bg-purple-700">
                Redeem
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {selectedCard && (
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Redeem Gift Card</DialogTitle>
              <DialogDescription>
                Are you sure you want to redeem this gift card? The token will be sent to your connected wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="mx-auto max-w-[280px]">
                <div className="overflow-hidden rounded-lg border border-purple-500/50 bg-gradient-to-br from-purple-950 to-slate-900 shadow-lg">
                  <div className="relative aspect-[4/3] bg-black/20">
                    <Image
                      src={selectedCard.image || "/placeholder.svg"}
                      alt={selectedCard.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{selectedCard.token} Gift Card</span>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        {selectedCard.tokenId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Amount</span>
                      <span className="font-medium">
                        {selectedCard.amount} {selectedCard.token}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Value</span>
                      <span className="text-sm text-zinc-300">${selectedCard.value.toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="border-purple-800/50" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleConfirmRedeem}>
                Redeem
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Processing Dialog */}
      <Dialog open={processingDialogOpen} onOpenChange={setProcessingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Processing Transaction</DialogTitle>
            <DialogDescription>Please wait while we process your redemption. This may take a moment.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          </div>
          <DialogFooter>
            <p className="text-xs text-muted-foreground">Do not close this window during processing.</p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      {selectedCard && (
        <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Gift Card Redeemed!
              </DialogTitle>
              <DialogDescription>Your token has been sent to your wallet successfully.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Token</span>
                    <span>{selectedCard.token}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Amount</span>
                    <span>
                      {selectedCard.amount} {selectedCard.token}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Value</span>
                    <span>${selectedCard.value.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setCompleteDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

type GiftCard = {
  id: string
  image: string
  name: string
  token: string
  amount: number
  value: number
  tokenId: string
}
