import { getAnnouncementBar } from "@/sanity/queries"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface AnnouncementBarProps {
  className?: string
}

export function AnnouncementBar({ className }: AnnouncementBarProps) {
  const [announcement, setAnnouncement] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Fetch announcement data
    getAnnouncementBar().then((data) => {
      if (data) {
        setAnnouncement(data)
        // Check if user has dismissed this announcement
        const dismissedKey = `announcement-${data._id}-dismissed`
        if (localStorage.getItem(dismissedKey)) {
          setDismissed(true)
          setIsVisible(false)
        }
      }
    })
  }, [])

  if (!announcement || dismissed || !isVisible) {
    return null
  }

  const bgColorClass = announcement.backgroundColor === "muted"
    ? "bg-muted"
    : announcement.backgroundColor === "custom" && announcement.customBackgroundColor
    ? ""
    : "bg-orange-500"

  const customBg = announcement.backgroundColor === "custom" && announcement.customBackgroundColor
    ? { backgroundColor: announcement.customBackgroundColor }
    : {}

  const textColorClass = announcement.textColor === "white"
    ? "text-white"
    : announcement.textColor === "black"
    ? "text-black"
    : announcement.textColor === "orange"
    ? "text-orange-600"
    : announcement.textColor === "custom" && announcement.customTextColor
    ? ""
    : "text-white"

  const customTextColor = announcement.textColor === "custom" && announcement.customTextColor
    ? { color: announcement.customTextColor }
    : {}

  const handleDismiss = () => {
    setIsVisible(false)
    setDismissed(true)
    if (announcement._id) {
      localStorage.setItem(`announcement-${announcement._id}-dismissed`, "true")
    }
  }

  return (
    <div
      className={`relative py-2.5 px-4 text-center text-sm font-medium ${textColorClass} ${bgColorClass}`}
      style={{ ...customBg, ...customTextColor }}
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        {announcement.headline && (
          <span className="flex items-center gap-2">
            <span>{announcement.headline}</span>
            {announcement.ctaLink && (
              <a
                href={announcement.ctaLink}
                className="underline underline-offset-2 hover:no-underline font-semibold"
              >
                {announcement.ctaText || "Learn more"}
              </a>
            )}
          </span>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
