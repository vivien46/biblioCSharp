import React, { useState, useEffect } from "react";

interface CarouselProps {
  items: {
    id: number;
    titre: string;
    imageUrl?: string;
  }[];
  }

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
  }, [items]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) {
    return <div className="text-center text-gray-500">Aucun élément à afficher.</div>;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-screen-lg mx-auto">
      {/* Wrapper du carrousel avec ratio 16:9 */}
      <div className="relative overflow-hidden w-full h-0 pb-[56.25%] bg-gray-200">
        <div
          className="absolute top-0 left-0 w-full h-full flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`min-w-full h-full relative flex items-center justify-center ${
                index === currentIndex ? "opacity-100" : "opacity-50"
              }`}
            >
              {/* Image */}
              <img
                src={item.imageUrl || "/default-image.jpg"}
                alt={item.titre}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />

              {/* Texte centré */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white text-center px-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">{item.titre}</h3>
                <p className="text-sm sm:text-base mt-2">Découvrez ce livre fascinant !</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons gauche et droite */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white bg-opacity-50 hover:bg-opacity-75 px-3 py-3 rounded-full focus:outline-none"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white bg-opacity-50 hover:bg-opacity-75 px-3 py-3 rounded-full focus:outline-none"
      >
        →
      </button>

      {/* Indicateurs sous forme de points */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-400"
            }`}
            style={{
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
