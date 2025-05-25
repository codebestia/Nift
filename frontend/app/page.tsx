import { LandingHero } from "@/components/landing-hero"
import { Features } from "@/components/features"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-black via-purple-950 to-black text-white">
      <Navbar />
      <main className="flex-1">
        <LandingHero />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
