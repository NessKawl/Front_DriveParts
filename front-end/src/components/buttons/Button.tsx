import { clsx } from "clsx"

type ButtonProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean;
  type?: "button" | "submit" | "reset" 
}

export default function Button({ children, className = "", onClick, type  }: ButtonProps) {
  return (
    <div>
      <button
        onClick={onClick}
        type={type}
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