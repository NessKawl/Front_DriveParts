import { clsx } from "clsx"

type AvatarProps = {
  src: string
  alt?: string
  size?: "sm" | "md" | "lg" | "xl" | "xl2" | "xl3"
  className?: string
}

export default function Avatar({ src, alt = "Avatar", size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    xl2: "w-32 h-32",
    xl3: "w-40 h-40",
  }

  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        "rounded-full",
        sizeClasses[size],
        className
      )}
    />
  )
}
