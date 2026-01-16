import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti'; // Optional usage if I had installed it, but sticking to standard

export default function OrderSuccess() {
  const { id } = useParams();

  useEffect(() => {
    // Simple confetti effect logic or just render
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
         <div className="flex justify-center mb-6">
             <CheckCircle className="text-green-500 w-20 h-20" />
         </div>
         <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
         <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
         
         <div className="bg-blue-50 p-4 rounded mb-8">
             <span className="block text-xs text-gray-500 uppercase font-bold">Order ID</span>
             <span className="block text-xl font-mono font-bold text-blue-700">#{id}</span>
         </div>
         
         <p className="text-sm text-gray-500 mb-8">
             We have sent a confirmation email to your registered email address.
         </p>
         
         <Link to="/" className="block w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
             Continue Shopping
         </Link>
      </div>
    </div>
  );
}
