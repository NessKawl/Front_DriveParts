interface ProductCardProps {
  image: string
  name: string
  price?: string
  parcelas?: string
  praso?: string
  reserva?: string
}

export default function CardProduto({ image, name, price, parcelas,praso, reserva }: ProductCardProps) {
  return (
    <div
      onClick={() => window.location.href = `/detalhe-produto?produto=${name}`}
      className="bg-white md:w-60 h-70 md:h-96 p-2 flex flex-col items-left justify-between rounded-lg md:rounded-sm shadow-md hover:shadow-lg hover:shadow-primary-orange/40 transition-shadow duration-300 cursor-pointer">
      <div className="flex flex-col md:w-full items-center">
        <img
          src={image}
          alt={name}
          onLoad={(e) => {
            e.currentTarget.style.filter = "none"
            e.currentTarget.style.opacity = "1"
          }}
          loading="lazy"
          className="w-32 h-32 md:w-48 md:h-48 mb-2 items-center" />
        <h3 className="text-sm md:text-lg font-semibold text-left line-clamp-3 md:line-clamp-4">{name}</h3>
      </div>
      <div className="flex flex-col items-left justify-left">
        <p className="text-primary-orange font-bold text-xl md:text-3xl">{price}</p>
        <p className="text-black-smooth font-semibold text-xs md:text-md">{parcelas}</p>
        <p className="text-black-smooth font-semibold text-md">{praso}</p>
        <p className="text-black-smooth font-semibold text-md">{reserva}</p>
      </div>
    </div>
  );
}