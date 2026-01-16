import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { Package } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('orders/');
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;
  if (orders.length === 0) return <div className="p-10 text-center">No past orders found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
       <h1 className="text-2xl font-bold mb-6">My Orders</h1>
       <div className="space-y-4">
          {orders.map(order => (
             <div key={order.id} className="bg-white p-6 shadow-sm rounded-md border border-gray-100">
                 <div className="flex justify-between items-center mb-4 pb-4 border-b">
                     <div className="flex items-center gap-2">
                         <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                             <Package size={20} />
                         </div>
                         <div>
                             <span className="block font-bold text-gray-800">Order #{order.id}</span>
                             <span className="text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                         </div>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                         order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                         order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                         'bg-yellow-100 text-yellow-700'
                     }`}>
                         {order.status}
                     </span>
                 </div>
                 
                 <div className="space-y-2">
                     {order.items && order.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.product_title || `Product #${item.product}`} x {item.quantity}</span>
                              <span className="font-medium">₹{parseInt(item.price).toLocaleString()}</span>
                         </div>
                     ))}
                 </div>
                 
                 <div className="mt-4 pt-4 border-t flex justify-between items-center">
                     <span className="text-sm text-gray-500">Total Amount</span>
                     <span className="text-lg font-bold">₹{parseInt(order.total_amount).toLocaleString()}</span>
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
}
