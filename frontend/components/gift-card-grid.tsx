"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Share2, Gift, Info, ExternalLink, Check, Loader2, PlusCircle } from "lucide-react"
import { GiftCard } from "@/types/gift-card"

interface GiftCardGridProps {
  giftCards: GiftCard[];
  isLoading?: boolean;
}

export function GiftCardGrid({ giftCards, isLoading = false }: GiftCardGridProps) {
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")

  const handleSendGift = (card: GiftCard) => {
    setSelectedCard(card)
    setRecipientAddress("")
    setSendDialogOpen(true)
  }

  const handleSendConfirm = () => {
    if (!recipientAddress.trim()) return

    setSendDialogOpen(false)
    setProcessingDialogOpen(true)

    // Simulate transaction processing
    setTimeout(() => {
      setProcessingDialogOpen(false)
      // Generate a fake transaction hash
      setTransactionHash(
        "0x" + Math.random().toString(16).substring(2, 16) + Math.random().toString(16).substring(2, 16),
      )
      setCompleteDialogOpen(true)
    }, 3000)
  }

  const resetDialogs = () => {
    setCompleteDialogOpen(false)
    setSelectedCard(null)
    setRecipientAddress("")
  }

  // Skeleton loader for cards
  const CardSkeleton = () => (
    <Card className="overflow-hidden bg-gradient-to-br from-purple-950/50 to-slate-900/50 border border-purple-800/20">
      <CardHeader className="p-0">
        <div className="relative aspect-square bg-black/20">
          <Skeleton className="h-full w-full" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  )

  return (
    <>
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <CardSkeleton key={index} />
            ))}
        </div>
      ) : giftCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-purple-900/20 p-4 mb-4">
            <Gift className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Gift Cards Found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            You don't have any gift cards yet. Purchase your first gift card to get started.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Purchase a Gift Card
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {giftCards.map((card) => (
            <Card
              key={card.id}
              className="overflow-hidden bg-gradient-to-br from-purple-950 to-slate-900 border border-purple-800/30 hover:border-purple-500/50 transition-all"
            >
              <CardHeader className="p-0">
                <div className="relative aspect-square bg-black/20">
                  <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-black/50 border-white/20 backdrop-blur-sm hover:bg-purple-800/50"
                            >
                              <Share2 className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share Gift Card</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Link
                        href={`https://voyager.io/token/${card.token_id}`}
                        target="_blank"
                        className="text-xs text-white/70 hover:text-white flex items-center gap-1"
                      >
                        View on Explorer <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{card.name}</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    {card.token_id}
                  </span>
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
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleSendGift(card)}>
                  <Gift className="mr-2 h-4 w-4" />
                  Send Gift
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10 border-purple-800/50">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">More Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Gift Card Details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Send Gift Dialog */}
      {selectedCard && (
        <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Gift Card</DialogTitle>
              <DialogDescription>Enter the wallet address of the recipient to send this gift card.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-purple-500/30">
                  <Image
                    src={selectedCard.image || "/placeholder.svg"}
                    alt={selectedCard.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedCard.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCard.amount} {selectedCard.token} (${selectedCard.value})
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-address">Recipient Address</Label>
                <Input
                  id="recipient-address"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="bg-background border-purple-800/50 focus-visible:ring-purple-500"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="border-purple-800/50" onClick={() => setSendDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleSendConfirm}
                disabled={!recipientAddress.trim()}
              >
                Send Gift
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
            <DialogDescription>
              Please wait while we process your transaction. This may take a moment.
            </DialogDescription>
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
        <Dialog open={completeDialogOpen} onOpenChange={resetDialogs}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Gift Card Sent!
              </DialogTitle>
              <DialogDescription>Your gift card has been successfully sent to the recipient.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Recipient</span>
                    <span className="text-sm truncate max-w-[200px]">{recipientAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Gift Card</span>
                    <span>
                      {selectedCard.amount} {selectedCard.token}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Transaction</span>
                    <Link
                      href={`https://etherscan.io/tx/${transactionHash}`}
                      target="_blank"
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                    >
                      View on Explorer <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={resetDialogs}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}



