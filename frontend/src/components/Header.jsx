import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold italic tracking-wider flex-shrink-0">
          Flipkart
          <span className="block text-xs font-normal not-italic text-gray-200 hover:underline">Explore Plus</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-grow max-w-xl relative hidden md:block">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full py-2 px-4 pr-10 rounded-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-0 top-0 h-full px-3 text-blue-600">
            <Search size={20} />
          </button>
        </form>

        <nav className="flex items-center gap-6 font-medium">
          <div className="hidden md:flex items-center gap-1 cursor-pointer hover:bg-blue-700 px-3 py-1 rounded transition">
             <User size={18} />
             <span>Login</span>
          </div>

          <Link to="/cart" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-1 rounded transition relative">
            <div className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
            </div>
            <span>Cart</span>
          </Link>
          
          <div className="hidden md:block hover:bg-blue-700 px-3 py-1 rounded transition cursor-pointer">
            Become a Seller
          </div>
        </nav>
      </div>
      <div className="md:hidden px-4 pb-2">
         <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 px-4 pr-10 rounded-sm text-gray-800 focus:outline-none"
             value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-0 top-0 h-full px-3 text-blue-600">
            <Search size={20} />
          </button>
        </form>
      </div>
    </header>
  );
}
