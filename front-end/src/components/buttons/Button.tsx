import { clsx } from "clsx"

type ButtonProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Button({ children, className = "", onClick }: ButtonProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className={clsx(
          "cursor-pointer transition",
          className
        )}
      >
        {children}
      </button>
    </div>
  );
}