interface ProductCardProps {
    image: string
    name: string
    reserva?: string
    status?: string
}
export default function CardProduto({ image, name, reserva, status }: ProductCardProps) {
    let statusColor = "text-gray-700";
    const nowstate = status === "CONCLUIDA" ? "Finalizado" : status === "CANCELADA" ? "RESERVA CANCELADA" : "EM RESERVA";
    if (status === "CONCLUIDA") statusColor = "text-pear-green";
    if (status === "CANCELADA") statusColor = "text-red-alert";
    if (status === "RESERVA") statusColor = "text-primary-orange";

    return (
        <div 
            onClick={() => window.location.href = `/detalhe-produto?produto=${name}`} 
            className="bg-white md:w-60 h-70 md:h-80 p-2 flex flex-col items-left justify-between items-start rounded-lg md:rounded-sm shadow-md hover:shadow-lg hover:shadow-primary-orange/40 transition-shadow duration-300 cursor-pointer text-center">

            <div className="flex flex-col md:w-full items-center">
                <img src={image} alt={name} className="w-32 h-32 md:w-40 md:h-40 mb-2 items-center" />
            </div>

            <h3 className="text-sm md:text-lg font-semibold line-clamp-3 md:line-clamp-4">{name}</h3>
            
            {reserva && <p className="text-black-smooth font-normal text-md">{reserva}</p>}
            {status && <p className={`${statusColor} text-black-smooth font-semibold text-lg`}>{nowstate}</p>}
        </div>

    );
}