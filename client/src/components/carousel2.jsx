


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots) => (
      <div className="flex justify-center mt-4">
        <ul className="flex justify-center absolute -top-5 left-1/2 right-1/2 space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <button className="w-3 h-3 bg-gray-400 rounded-full  hover:bg-gray-600 transition-all"></button>
    ),
  };

  const images = [
    'images/gymbg.jpg',
    'images/GYM2.jpg',
    'images/cardio.jpg',
    
  ];

  return (
    <div className="carousel-container mb-8 mx-auto  mt-4 max-w-full-xl">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="h-[300px]">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
