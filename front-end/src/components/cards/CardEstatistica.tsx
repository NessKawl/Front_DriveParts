interface  CardEstatisticaProps{
    titulo: string,
    valor: string
}
export default function CardEstatistica({titulo, valor }: CardEstatisticaProps) {
    return (
        <div className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 min-w-50">
            <div>
                <h2 className="text-md text-primary-orange">{titulo}</h2>

            </div>
            <div className="flex justify-center items-center h-full mb-2">
                <h1 className="text-6xl text-ice">{valor}</h1>
            </div>

        </div>
    );
}