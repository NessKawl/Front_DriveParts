import React, { useRef, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface InfiniteProductCarouselProps {
  products: Product[];
  speed?: number; // em pixels por segundo
}

const InfiniteProductCarousel: React.FC<InfiniteProductCarouselProps> = ({
  products,
  speed = 50,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrame: number;
    let position = 0;

    const step = () => {
      position -= speed / 60; // pixels por frame (~60fps)
      if (carousel.scrollWidth > 0) {
        if (Math.abs(position) >= carousel.scrollWidth / 2) {
          position = 0; // reseta posição (loop perfeito)
        }
      }
      carousel.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  return (
    <div className="overflow-hidden w-full relative z-10 p-2">
      <div
        ref={carouselRef}
        className="flex gap-4 w-max"
        style={{ willChange: "transform" }}
      >
        {[...products, ...products].map((product, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-48 h-48 sm:w-56 bg-white rounded-xl shadow-md p-3 hover:scale-105 transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded-xl"
            />
            <div className="mt-2 text-center">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-sm text-primary-orange font-semibold">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteProductCarousel;
