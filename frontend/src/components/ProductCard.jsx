import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  // Mock rating
  const rating = (Math.random() * 2 + 3).toFixed(1);
  const ratingCount = Math.floor(Math.random() * 5000);

  return (
    <div className="bg-white p-4 hover:shadow-lg transition flex flex-col items-center group relative border border-gray-100 min-h-[350px]">
      <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 z-10">
        <Heart size={20} fill="currentColor" className="text-transparent hover:text-red-500" stroke="currentColor"/> // Simplified heart interaction
      </button>

      <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden">
         {product.image ? (
            <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"/>
         ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
              No Image
            </div>
         )}
      </div>

      <div className="w-full text-left">
        <Link to={`/product/${product.id}`} className="text-sm font-medium hover:text-blue-600 line-clamp-2 mb-2 block">
          {product.title}
        </Link>

        {/* Rating Badge */}
        <div className="flex items-center gap-2 mb-2">
           <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
             {rating} ★
           </span>
           <span className="text-gray-500 text-xs font-medium">({ratingCount})</span>
        </div>

        <div className="flex items-center gap-2 mb-1">
           <span className="text-lg font-bold">₹{parseInt(product.price).toLocaleString()}</span>
           <span className="text-gray-500 text-xs line-through">₹{parseInt(product.price * 1.2).toLocaleString()}</span>
           <span className="text-green-600 text-[10px] font-bold">20% off</span>
        </div>
        
        <div className="text-xs text-gray-500">Free delivery</div>
      </div>
    </div>
  );
}
