interface ProductCardProps {
    image: string
    name: string
    reserva?: string
    status?: string
    onClick?: () => void;
}
export default function CardProduto({ image, name, reserva, status, onClick }: ProductCardProps) {
    let statusColor = "text-gray-700";
    const nowstate = status === "CONCLUIDA" ? "CONCLUIDA" : status === "CANCELADA" ? "CANCELADA" : "RESERVA ATIVA";
    if (status === "CONCLUIDA") statusColor = "text-pear-green";
    if (status === "CANCELADA") statusColor = "text-red-alert";
    if (status === "RESERVA") statusColor = "text-primary-orange";

    return (
        <div 
            onClick={onClick}
            className="bg-white md:w-60 h-70 md:h-80 p-2 flex flex-col items-center justify-between  rounded-lg md:rounded-sm shadow-md hover:shadow-lg hover:shadow-primary-orange/40 transition-shadow duration-300 cursor-pointer text-center">
                

            <div className="flex flex-col md:w-full items-center">
                <img src={image} alt={name} className="w-32 h-32 md:w-40 md:h-40 mb-2 object-contain" />
            </div>

            <h3 className="text-sm md:text-lg font-semibold line-clamp-3 md:line-clamp-4">{name}</h3>
            
            {reserva && <p className="text-black-smooth font-normal text-md">{reserva}</p>}
            {status && <p className={`${statusColor} text-black-smooth font-semibold text-lg`}>{nowstate}</p>}
        </div>

    );
}