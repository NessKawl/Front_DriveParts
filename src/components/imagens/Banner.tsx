import { useEffect, useState } from "react"

const images = [
  "/banners/banner1.jpg",
  "/banners/banner2.jpg",
  "/banners/banner3.jpg",
]

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative z-20 w-full h-32 md:h-80 overflow-hidden mx-2 md:mx-4">

      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Banner ${index + 1}`}
          loading="lazy"
          onLoad={(e) => {
            e.currentTarget.style.filter = "none"
            e.currentTarget.style.opacity = "1"
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        />
      ))}
    </div>
  )
}
