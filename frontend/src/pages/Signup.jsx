import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      alert("Registration successful! Please login.");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
         {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{typeof error === 'object' ? JSON.stringify(error) : error}</div>}
         
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
               <input 
                 type="text" 
                 className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                 value={formData.username}
                 onChange={(e) => setFormData({...formData, username: e.target.value})}
                 required
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
               <input 
                 type="email" 
                 className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 required
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
               <input 
                 type="password" 
                 className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                 value={formData.password}
                 onChange={(e) => setFormData({...formData, password: e.target.value})}
                 required
               />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
              disabled={status === 'loading'}
            >
               {status === 'loading' ? 'Signing up...' : 'Continue'}
            </button>
         </form>
         
         <p className="mt-4 text-center text-sm text-gray-600">
            Existing User? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
         </p>
      </div>
    </div>
  );
}
