import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/wishlistSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  // Check if product is in wishlist
  // Note: wishlistItems has structure { id, product: id, product_details: {...} } or similar depending on fetch
  // My backend serializer returns `product` as ID and `product_details` as object.
  // My slice normalization might need care.
  // Let's assume `items` array contains objects with `product` (ID).
  const isInWishlist = wishlistItems.some(item => (item.product_details?.id || item.product) === product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault(); // Prevent Link navigation
    if (!isAuthenticated) {
      alert("Please login to use Wishlist");
      return;
    }
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="bg-white hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center group relative border border-transparent hover:border-gray-200">
      <div className="w-full h-48 mb-4 relative flex items-center justify-center">
         <button 
           className="absolute top-0 right-0 p-1 text-gray-300 z-10 hover:scale-110 transition-transform"
           onClick={handleWishlistClick}
         >
           <Heart 
             size={20} 
             className={`${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-500'}`} 
           />
         </button>
         <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            {product.image ? (
                <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">No Image</div>
            )}
         </Link>
      </div>

      <div className="w-full text-left self-start">
         <h3 className="text-sm font-medium hover:text-blue-600 truncate cursor-pointer transition-colors max-w-full" title={product.title}>
            <Link to={`/product/${product.id}`}>{product.title}</Link>
         </h3>
         
         <div className="flex items-center gap-2 mt-1">
            <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                4.4 <Star size={8} fill="currentColor" />
            </span>
            <span className="text-gray-500 text-xs">(1,234)</span>
         </div>
         
         <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-base">₹{parseInt(product.price).toLocaleString()}</span>
            <span className="text-gray-500 text-xs line-through">₹{parseInt(product.price * 1.2).toLocaleString()}</span>
            <span className="text-green-600 text-[10px] font-bold">20% off</span>
         </div>
      </div>
    </div>
  );
}
