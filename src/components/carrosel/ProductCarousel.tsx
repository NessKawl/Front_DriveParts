import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductCarouselProps = {
  images: string[];
};

export default function ProductCarousel({ images }: ProductCarouselProps) {
  const [current, setCurrent] = useState(0);

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full lg:max-h-[500px]   overflow-hidden rounded-xl flex  flex-col items-center ">
      {/* Imagem principal */}
        <div className="relative h-90 md:h-98 w-full flex justify-center items-center">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Produto ${index + 1}`}
            className={`absolute w-70 h-70 sm:w-78 sm:h-78 lg:w-98 lg:h-98  object-cover transition-opacity duration-700 ease-in-out  ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ))}
      </div>
      
      

      {/* Botão esquerdo */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Botão direito */}
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Miniaturas / indicadores */}
      <div className="flex justify-center mt-3 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full mb-2 ${
              index === current ? "bg-primary-orange" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
