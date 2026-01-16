import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../store/cartSlice';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total_price } = useSelector((state) => state.cart);
  
  const [address, setAddress] = useState({
     name: 'Siddharth Nama',
     phone: '9876543210',
     street: '123 Tech Park',
     city: 'Bengaluru',
     state: 'Karnataka',
     zip: '560001',
  });
  
  const [step, setStep] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const price = items.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
  const discount = price * 0.2;
  const total = price - discount;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
        const fullAddress = `${address.name}, ${address.street}, ${address.city}, ${address.state} - ${address.zip}. Phone: ${address.phone}`;
        const res = await axios.post('orders/', { address: fullAddress });
        navigate(`/order-success/${res.data.id}`);
    } catch (error) {
        console.error("Order placement failed", error);
        alert("Failed to place order. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  if (items.length === 0) return <div className="p-10 text-center">Your cart is empty.</div>;

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-4 bg-gray-100 min-h-screen">
       <div className="flex-grow space-y-4">
           
           <div className="bg-white p-4 shadow-sm flex justify-between items-center opacity-70">
              <div className="flex gap-4">
                 <span className="bg-gray-200 text-blue-600 w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm">1</span>
                 <div>
                    <h3 className="uppercase font-bold text-gray-500 text-sm">Login</h3>
                    <p className="text-sm font-bold text-black">+91 9876543210</p>
                 </div>
              </div>
              <button className="text-blue-600 font-medium text-sm border border-blue-200 px-4 py-1 uppercase">Change</button>
           </div>

           <div className="bg-white shadow-sm">
               <div className={`p-4 ${step === 2 ? 'bg-blue-600 text-white' : 'bg-white'} flex justify-between items-center`}>
                  <div className="flex gap-4 items-center">
                     <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm ${step === 2 ? 'bg-white text-blue-600' : 'bg-gray-200 text-blue-600'}`}>2</span>
                     <h3 className="uppercase font-bold text-sm">Delivery Address</h3>
                  </div>
               </div>
               
               {step === 2 && (
                   <div className="p-6">
                       <div className="flex gap-2 mb-4">
                           <input type="radio" checked className="mt-1"/>
                           <div className="ml-2">
                               <div className="flex items-center gap-4 mb-2">
                                   <span className="font-bold">{address.name}</span>
                                   <span className="bg-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Home</span>
                                   <span className="font-bold">{address.phone}</span>
                                </div>
                               <p className="text-sm text-gray-600">
                                   {address.street}, {address.city}, {address.state} - <span className="font-bold">{address.zip}</span>
                               </p>
                               <button 
                                 onClick={() => setStep(3)}
                                 className="mt-4 bg-orange-500 text-white px-6 py-3 uppercase font-bold text-sm shadow-sm hover:bg-orange-600"
                               >
                                   Deliver Here
                               </button>
                           </div>
                       </div>
                   </div>
               )}
               {step > 2 && (
                   <div className="p-4 flex gap-2 pl-14 items-center">
                        <span className="font-bold text-sm">{address.name}</span>
                        <span className="text-sm">{address.street}, {address.city} - {address.zip}</span>
                        <button onClick={() => setStep(2)} className="ml-auto text-blue-600 uppercase text-xs font-bold border border-gray-200 px-4 py-1">Change</button>
                   </div>
               )}
           </div>

           <div className="bg-white shadow-sm">
               <div className={`p-4 ${step === 3 ? 'bg-blue-600 text-white' : 'bg-white'} flex justify-between items-center`}>
                  <div className="flex gap-4 items-center">
                     <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm ${step === 3 ? 'bg-white text-blue-600' : 'bg-gray-200 text-blue-600'}`}>3</span>
                     <h3 className="uppercase font-bold text-sm">Order Summary</h3>
                  </div>
               </div>
               
               {step === 3 && (
                   <div className="p-4">
                       {items.map(item => (
                           <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                               <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
                                  {item.product.image && <img src={item.product.image} className="w-full h-full object-contain" alt=""/>}
                               </div>
                               <div>
                                   <h4 className="font-medium text-sm">{item.product.title}</h4>
                                   <div className="text-xs text-gray-500 mt-1">{item.quantity} Quantity</div>
                                   <div className="flex items-center gap-2 mt-2">
                                        <span className="font-bold">₹{parseInt(item.product.price * 0.8).toLocaleString()}</span>
                                        <span className="text-gray-500 text-xs line-through">₹{parseInt(item.product.price).toLocaleString()}</span>
                                        <span className="text-green-600 text-xs font-bold">20% Off</span>
                                   </div>
                               </div>
                           </div>
                       ))}
                       <button 
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className={`bg-orange-500 text-white px-6 py-3 uppercase font-bold text-sm shadow-sm hover:bg-orange-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                       >
                           {loading ? 'Processing...' : 'Continue to Payment'} 
                       </button>
                       <p className="text-xs text-gray-500 mt-2">Assuming Payment is simplified for this demo, usually Step 4.</p>
                   </div>
               )}
               {step > 3 && (
                   <div className="p-4 pl-14 text-sm font-bold">
                       {items.length} items
                   </div>
               )}
           </div>
           
           <div className="bg-white p-4 shadow-sm flex items-center gap-4 text-gray-400">
               <span className="bg-gray-200 text-gray-500 w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm">4</span>
               <h3 className="uppercase font-bold text-sm">Payment Options</h3>
           </div>

       </div>

       <div className="w-full md:w-80 flex-shrink-0">
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
                      <span>Total Payable</span>
                      <span>₹{total.toLocaleString()}</span>
                  </div>
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
