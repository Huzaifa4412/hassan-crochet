"use client"

import { useEffect, useState } from "react"
import { Mail, Sparkles, CheckCircle2 } from "lucide-react"
import { getNewsletter } from "@/sanity/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface NewsletterProps {
  className?: string
  variant?: "default" | "compact" | "minimal"
}

export function Newsletter({ className, variant = "default" }: NewsletterProps) {
  const [newsletter, setNewsletter] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    getNewsletter().then((data) => {
      if (data) {
        setNewsletter(data)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    // Simulate API call - replace with your actual newsletter service
    try {
      // Example: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus("success")
      setMessage(newsletter?.successMessage || "Thank you for subscribing!")
      setEmail("")
      setTimeout(() => setStatus("idle"), 5000)
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  if (!newsletter) {
    return null
  }

  if (variant === "compact") {
    return (
      <div className={cn("bg-muted/50 rounded-xl p-6", className)}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder={newsletter.placeholderText || "Enter your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-11 whitespace-nowrap"
          >
            {status === "loading" ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Subscribed!
              </>
            ) : (
              newsletter.buttonText || "Subscribe"
            )}
          </Button>
        </form>
        {status === "success" && message && (
          <p className="text-sm text-green-600 mt-2">{message}</p>
        )}
        {status === "error" && message && (
          <p className="text-sm text-destructive mt-2">{message}</p>
        )}
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn(className)}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder={newsletter.placeholderText || "Enter your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
              className="pl-10"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={status === "loading" || status === "success"}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shrink-0"
          >
            {status === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : status === "loading" ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    )
  }

  // Default variant - full featured
  const getBgColorClass = (bgColor?: string) => {
    switch (bgColor) {
      case "orange-gradient":
        return "bg-gradient-to-r from-orange-50 via-background to-orange-50"
      case "pink-gradient":
        return "bg-gradient-to-r from-pink-50 via-background to-pink-50"
      case "muted":
        return "bg-muted"
      case "image":
        return "relative"
      default:
        return "bg-muted/30"
    }
  }

  const bgColorClass = getBgColorClass(newsletter.backgroundColor)

  return (
    <section
      className={cn(
        "py-16 md:py-24 px-4",
        bgColorClass,
        className
      )}
      style={
        newsletter.backgroundColor === "custom" && newsletter.customBackgroundColor
          ? { backgroundColor: newsletter.customBackgroundColor }
          : {}
      }
    >
      {newsletter.image && newsletter.backgroundColor === "image" && (
        <div
          className="absolute inset-0 opacity-10 -z-10"
          style={{
            backgroundImage: `url(${newsletter.image.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <div className="container mx-auto max-w-3xl">
        <Card className="border-none shadow-xl">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {newsletter.headline}
            </h2>

            {/* Description */}
            {newsletter.description && (
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {newsletter.description}
              </p>
            )}

            {/* Discount Offer */}
            {newsletter.discountOffer && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold">
                <Sparkles className="w-4 h-4" />
                {newsletter.discountOffer}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={newsletter.placeholderText || "Enter your email address"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <Button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold h-12 text-lg"
              >
                {status === "loading" ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Subscribed!
                  </>
                ) : (
                  newsletter.buttonText || "Subscribe"
                )}
              </Button>
            </form>

            {/* Success/Error Message */}
            {status === "success" && message && (
              <p className="text-green-600 font-medium animate-in fade-in slide-in-from-bottom-2">
                {message}
              </p>
            )}
            {status === "error" && message && (
              <p className="text-destructive font-medium animate-in fade-in slide-in-from-bottom-2">
                {message}
              </p>
            )}

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

import { ArrowRight } from "lucide-react"

export default Newsletter
