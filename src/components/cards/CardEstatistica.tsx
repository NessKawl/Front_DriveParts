interface  CardEstatisticaProps{
    titulo: string,
    valor: string | number,
    className?: string
}
export default function CardEstatistica({titulo, valor, className }: CardEstatisticaProps) {
    return (
        <div className={className}>
            <div>
                <h2 className="text-md text-primary-orange">{titulo}</h2>

            </div>
            <div className="flex justify-center items-center h-full mb-2 whitespace-nowrap">
                <h1 className="text-6xl text-ice">{valor}</h1>
            </div>

        </div>
    );
}