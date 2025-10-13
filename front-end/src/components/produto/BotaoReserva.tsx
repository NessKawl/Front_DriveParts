interface BotaoReservaProps {
  onClick?: () => void;
}

export default function BotaoReserva({ onClick }: BotaoReservaProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className="rounded-4xl bg-primary-orange px-15 py-1 lg:px-25 lg:py-2"
      >
        Reservar
      </button>
    </div>
  );
}
