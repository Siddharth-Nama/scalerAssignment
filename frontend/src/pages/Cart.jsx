import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, addToCart, removeFromCart } from '../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShieldCheck } from 'lucide-react';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total_price, status } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const updateQuantity = async (itemId, quantity) => {
      if (quantity < 1) return;
      try {
          const axios = (await import('../utils/axios')).default;
          await axios.patch(`cart/items/${itemId}/`, { quantity });
          dispatch(fetchCart());
      } catch (e) {
          console.error(e);
      }
  };

  if (status === 'loading') return <div className="p-10 text-center">Loading Cart...</div>;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center bg-white shadow-sm mt-4 pb-20">
        <h2 className="text-xl font-medium mb-4">My Cart</h2>
        <div className="flex flex-col items-center">
            <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" className="w-48 mb-4" alt="Empty Cart"/>
            <p className="text-lg mb-4">Your cart is empty!</p>
            <Link to="/" className="bg-blue-600 text-white px-10 py-2 font-medium shadow-sm hover:bg-blue-700">Shop Now</Link>
        </div>
      </div>
    );
  }

  const price = items.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
  const discount = price * 0.2;
  const delivery = 0;
  const total = price - discount + delivery;

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-4">
      
      <div className="flex-grow">
         
         <div className="bg-white shadow-sm mb-4">
             <div className="p-4 border-b flex justify-between items-center">
                 <h2 className="font-medium">My Cart ({items.length})</h2>
                 <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck size={16} className="text-blue-600"/>
                    <span>100% Safe & Secure Payments</span>
                 </div>
             </div>
             
             {items.map(item => (
                 <div key={item.id} className="p-4 border-b flex gap-4">
                     <div className="w-24 h-24 flex-shrink-0">
                         {item.product.image ? (
                             <img src={item.product.image} className="w-full h-full object-contain" alt=""/>
                         ) : (
                             <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">No Image</div>
                         )}
                     </div>
                     <div className="flex-grow">
                         <h3 className="font-medium hover:text-blue-600 cursor-pointer line-clamp-2">{item.product.title}</h3>
                         <div className="text-xs text-gray-500 mt-1">{item.product.category?.name}</div>
                         
                         <div className="flex items-center gap-3 mt-2">
                            <span className="font-bold text-lg">₹{parseInt(item.product.price * 0.8).toLocaleString()}</span>
                            <span className="text-gray-500 text-sm line-through">₹{parseInt(item.product.price).toLocaleString()}</span>
                            <span className="text-green-600 text-sm font-bold">20% Off</span>
                         </div>
                         
                         <div className="flex items-center gap-6 mt-4">
                             <div className="flex items-center gap-2">
                                 <button 
                                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                 >
                                     <Minus size={12}/>
                                 </button>
                                 <input type="text" value={item.quantity} readOnly className="w-10 text-center border-gray-300 text-sm font-medium"/>
                                 <button 
                                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                 >
                                     <Plus size={12}/>
                                 </button>
                             </div>
                             <button 
                                onClick={() => dispatch(removeFromCart(item.id))}
                                className="font-medium hover:text-blue-600 uppercase text-sm"
                             >
                                 Remove
                             </button>
                         </div>
                     </div>
                 </div>
             ))}
             
             <div className="p-4 flex justify-end sticky bottom-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                 <button 
                    onClick={() => navigate('/checkout')}
                    className="bg-orange-500 text-white px-10 py-3 font-bold uppercase shadow-sm hover:bg-orange-600"
                 >
                     Place Order
                 </button>
             </div>
         </div>
      </div>

      <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white shadow-sm sticky top-20">
              <div className="p-4 border-b">
                  <h3 className="text-gray-500 font-bold uppercase text-sm">Price Details</h3>
              </div>
              <div className="p-4 space-y-4 text-sm">
                  <div className="flex justify-between">
                      <span>Price ({items.length} items)</span>
                      <span>₹{price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                      <span>Delivery Charges</span>
                      <span>FREE</span>
                  </div>
                  <div className="border-t border-dashed my-4"></div>
                  <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span>₹{total.toLocaleString()}</span>
                  </div>
              </div>
              <div className="p-4 border-t text-green-600 font-medium text-sm">
                  You will save ₹{discount.toLocaleString()} on this order
              </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 p-4">
              <ShieldCheck size={24} className="text-gray-400"/>
              <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
          </div>
      </div>

    </div>
  );
}
