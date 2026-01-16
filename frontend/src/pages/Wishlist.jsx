import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../store/wishlistSlice';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
      return (
          <div className="p-10 text-center">
              <h2 className="text-xl font-bold mb-4">Please Login to view your Wishlist</h2>
              <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Login Now</Link>
          </div>
      );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center bg-white shadow-sm mt-4 pb-20">
        <h2 className="text-xl font-medium mb-4">My Wishlist</h2>
        <div className="flex flex-col items-center">
            <Heart size={48} className="text-gray-300 mb-4" />
            <p className="text-lg mb-4">Your wishlist is empty!</p>
            <Link to="/" className="bg-blue-600 text-white px-10 py-2 font-medium shadow-sm hover:bg-blue-700">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
       <h1 className="text-2xl font-bold mb-6">My Wishlist ({items.length})</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {items.map(item => {
               const product = item.product_details;
               if (!product) return null;
               return (
                   <div key={item.id} className="bg-white p-4 shadow-sm hover:shadow-md transition relative group">
                        <button 
                            onClick={() => dispatch(toggleWishlist(product))}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 z-10"
                        >
                            <Trash2 size={20} />
                        </button>
                        <Link to={`/product/${product.id}`} className="block">
                            <div className="h-48 flex items-center justify-center p-4">
                                <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="mt-4">
                                <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[48px]">{product.title}</h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="font-bold text-lg">₹{parseInt(product.price).toLocaleString()}</span>
                                    {/* Mock discount logic */}
                                    <span className="text-gray-500 text-sm line-through">₹{parseInt(product.price * 1.2).toLocaleString()}</span>
                                    <span className="text-green-600 text-xs font-bold">20% off</span>
                                </div>
                            </div>
                        </Link>
                   </div>
               );
           })}
       </div>
    </div>
  );
}
