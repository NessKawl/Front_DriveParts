import clsx from "clsx"
interface ProductCardProps {
  image: string
  name: string
  id: string
  price?: string
  parcelas?: string
  praso?: string
  reserva?: string
  status?: string
}
export default function CardProduto({ image, name, price, parcelas, praso, reserva, status, id }: ProductCardProps) {
  return (
    <div
      onClick={() => window.location.href = `/detalhe-produto?uuid=${id}`}
      className="group bg-white md:w-60 h-70 md:h-96 p-3 flex flex-col justify-between
                 rounded-2xl shadow-sm border border-black-smooth/5
                 hover:shadow-xl hover:shadow-primary-orange/15
                 hover:-translate-y-1 transition-all duration-300 cursor-pointer
                 overflow-hidden relative"
    >
      {/* Glow sutil no hover */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full
                      bg-primary-orange/0 group-hover:bg-primary-orange/5
                      blur-3xl transition-all duration-500 pointer-events-none" />

      {/* Imagem */}
      <div className="flex flex-col items-center relative z-10">
        <div className="w-full flex items-center justify-center rounded-xl p-2 mb-3">
          <img
            src={image}
            alt={name}
            onLoad={(e) => {
              e.currentTarget.style.filter = "none"
              e.currentTarget.style.opacity = "1"
            }}
            loading="lazy"
            className="w-28 h-28 md:w-44 md:h-44 object-contain
                       group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="text-sm md:text-base font-semibold text-black-smooth
                       text-left w-full line-clamp-2 md:line-clamp-3 leading-snug">
          {name}
        </h3>
      </div>

      {/* Info de preço / status */}
      <div className="flex flex-col mt-auto pt-2 relative z-10">
        {price && (
          <p className="text-pear-green font-extrabold text-xl md:text-2xl tracking-tight">
            {price}
          </p>
        )}
        {parcelas && (
          <p className="text-black-smooth/50 font-medium text-[11px] md:text-xs mt-0.5">
            {parcelas}
          </p>
        )}
        {praso && <p className="text-black-smooth font-semibold text-sm mt-1">{praso}</p>}
        {reserva && <p className="text-black-smooth font-semibold text-sm">{reserva}</p>}
        {status && (
          <p className={clsx(
            "font-bold text-sm mt-1",
            status === "Finalizado" ? "text-pear-green" : "text-red-alert"
          )}>
            {status}
          </p>
        )}

        {/* Botão */}
        <button
          className="mt-3 w-full py-2 rounded-xl text-sm font-semibold
                     bg-pear-green text-white
                     shadow-sm shadow-pear-green/20
                     hover:shadow-md hover:shadow-pear-green/30
                     active:scale-[0.97] transition-all duration-200"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}