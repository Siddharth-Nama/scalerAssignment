import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice'; // Import toggle action
import axios from '../utils/axios';
import { ShoppingCart, Zap, Star, Heart } from 'lucide-react'; // Import Heart

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Redux Selectors
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`products/${id}/`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  const images = [product.image, product.image, product.image, product.image];

  // Wishlist Check
  const isInWishlist = wishlistItems.some(item => (item.product_details?.id || item.product) === product.id);

  const handleAddToCart = () => {
    dispatch(addToCart({ product_id: product.id, quantity: 1 }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product_id: product.id, quantity: 1 }));
    navigate('/cart');
  };

  const handleWishlistClick = () => {
      if (!isAuthenticated) {
          alert("Please login to use Wishlist");
          return;
      }
      dispatch(toggleWishlist(product));
  };


  return (
    <div className="container mx-auto px-4 py-6 bg-white shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 relative">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 overflow-auto">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`border p-1 cursor-pointer w-16 h-16 ${activeImage === idx ? 'border-blue-600' : 'border-gray-300'}`}
                  onMouseEnter={() => setActiveImage(idx)}
                >
                  {img ? <img src={img} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-gray-200" />}
                </div>
              ))}
            </div>
            
            <div className="flex-grow border border-gray-100 p-4 flex items-center justify-center h-96 relative">
               <button 
                  className="absolute top-4 right-4 p-2 rounded-full border border-gray-200 text-gray-400 hover:text-red-500 bg-white shadow-sm hover:shadow-md transition-all scale-100 hover:scale-110"
                  onClick={handleWishlistClick}
               >
                 <Heart 
                    size={20} 
                    className={`${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} 
                 />
               </button>
               {images[activeImage] ? (
                  <img src={images[activeImage]} alt={product.title} className="max-h-full max-w-full object-contain" />
               ) : (
                  <div className="text-gray-400">No Image</div>
               )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 uppercase flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingCart fill="currentColor" size={20} />
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 uppercase flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap fill="currentColor" size={20} />
              Buy Now
            </button>
          </div>
        </div>

        <div className="md:col-span-7">
           <h1 className="text-xl font-medium mb-2">{product.title}</h1>
           
           <div className="flex items-center gap-2 mb-4">
             <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
               4.5 <Star size={10} fill="currentColor" />
             </span>
             <span className="text-gray-500 text-sm font-medium">2,500 Ratings & 100 Reviews</span>
           </div>

           <div className="flex items-center gap-3 mb-4">
             <span className="text-3xl font-bold">₹{parseInt(product.price).toLocaleString()}</span>
             <span className="text-gray-500 text-sm line-through">₹{parseInt(product.price * 1.2).toLocaleString()}</span>
             <span className="text-green-600 font-bold text-sm">20% off</span>
           </div>

           <div className="mb-6">
             <h3 className="font-bold text-sm mb-2">Available offers</h3>
             <ul className="text-sm space-y-2">
               <li className="flex items-start gap-2">
                 <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-0.5" alt="" />
                 <span>Bank Offer 5% Cashback on Flipkart Axis Bank Card</span>
               </li>
               <li className="flex items-start gap-2">
                 <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-0.5" alt="" />
                 <span>Special Price Get extra 20% off (price inclusive of discount)</span>
               </li>
             </ul>
           </div>

            <div className="border p-4">
             <h3 className="font-bold text-lg mb-4 border-b pb-2">Product Description</h3>
             <p className="text-gray-700 leading-relaxed text-sm">
               {product.description}
             </p>
           </div>
           
           <div className="mt-4 border p-4">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                 <div className="flex">
                    <span className="text-gray-500 w-1/3">Category</span>
                    <span>{product.category?.name}</span>
                 </div>
                 <div className="flex">
                    <span className="text-gray-500 w-1/3">Stock</span>
                    <span>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
