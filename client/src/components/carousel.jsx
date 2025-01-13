import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const categories = [
  {
    id: 1,
    name: "SUPPLEMENTS",
    image: "images/supplements.webp",
    route: "nutrition and hydration",
  },
  {
    id: 2,
    name: "STRENGTH",
    image: "images/gym5.jpg",
    route: "strength training equipment",
  },
  {
    id: 3,
    name: "YOGA",
    image: "images/yoga.jpg",
    route: "yoga and flexibility",
  },
  {
    id: 4,
    name: "ACCESSORIES",
    image: "images/gym1.jpg",
    route: "accessories",
  },
  {
    id: 5,
    name: "CARDIO",
    image: "images/hard cardio.jpg",
    route: "cardio",
  },
];

const Carousel = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto my-8 px-4">
      {/* First Carousel */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide mb-12">
        {categories.map((category) => (
          <div
            key={category.id}
            className="min-w-[150px] max-w-96 flex-shrink-0 text-center shadow-lg cursor-pointer"
            onClick={() => navigate(`/category/${category.route}`)}
          >
            <div className="relative w-72 h-72 mx-auto rounded-lg overflow-hidden ">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
              />
              <p className="absolute bottom-0 bg-black/70 text-white w-full py-2 font-semibold">
                {category.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Carousel;
