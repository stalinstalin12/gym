import { useState, useEffect } from "react";

const images = [
  {src:"images/gymbg.jpg",
    text:""
  },
  {src:"images/gym1.jpg",
    text:""
  },
  {src:"images/gymbg2.webp",
    text:""
  },
  
  
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className=" container mx-auto relative w-full h-[60vh] sm:h-[70vh] md:h-[70vh] lg:h-[78vh] overflow-hidden bg-black ">
      {/* Carousel Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full">
            <img
              src={image.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-contain"/>
              <div className="font-bold absolute top-1/4 left-1/2  bg-opacity-60 text-white font-mono text-2xl">
                <h1>{image.text}</h1>
            </div>
          </div>
          
        ))}
        
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 flex justify-center items-center w-full">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`mx-1 w-3 h-3 rounded-full ${
              currentIndex === index
                ? "bg-gray-800 sm:w-4 sm:h-4"
                : "bg-gray-400 sm:w-3 sm:h-3"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
