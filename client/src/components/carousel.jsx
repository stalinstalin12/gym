
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Supplements',
    image: 'images/supplement.jpg', // Replace with actual image URL
    route: 'nutrition and hydration',
  },
  {
    id: 2,
    name: 'Strength',
    image: 'images/gymbg2.jpg', // Replace with actual image URL
    route: 'strength training equipment',
  },
  {
    id: 3,
    name: 'Football',
    image: 'images/gymbg.jpg', // Replace with actual image URL
    route: '/category/football',
  },
  {
    id: 4,
    name: 'Tennis',
    image: 'images/gym1.jpg', // Replace with actual image URL
    route: '/category/tennis',
  },
  {
    id: 5,
    name: 'Cycling',
    image: 'images/gym5.jpg', // Replace with actual image URL
    route: '/category/cycling',
  },
  {
    id: 6,
    name: 'Swimming',
    image: 'images/gymbg2.webp', // Replace with actual image URL
    route: '/category/swimming',
  },
];

const Carousel = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto my-8 px-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Favorite Sports</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            className="min-w-[150px] flex-shrink-0 text-center cursor-pointer"
            onClick={() => navigate(`/category/${category.route}`)}
          >
            <div className="w-70 h-80 mx-auto rounded-lg overflow-hidden shadow-lg">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
              />
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-700">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
