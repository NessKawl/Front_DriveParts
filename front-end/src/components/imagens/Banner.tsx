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
    <div className="relative  w-full h-32 md:h-80 overflow-hidden mx-2 md:mx-4">
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
          className={`absolute  w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
    </div>
  )
}
