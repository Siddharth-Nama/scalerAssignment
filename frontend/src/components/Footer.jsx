import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-10 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-gray-200 uppercase mb-4 font-semibold tracking-wide">About</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:underline hover:text-white transition">Contact Us</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">About Us</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">Careers</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">Flipkart Stories</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-200 uppercase mb-4 font-semibold tracking-wide">Help</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:underline hover:text-white transition">Payments</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">Shipping</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">Cancellation & Returns</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-200 uppercase mb-4 font-semibold tracking-wide">Policy</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:underline hover:text-white transition">Return Policy</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">Terms Of Use</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">Security</Link></li>
            <li><Link to="#" className="hover:underline hover:text-white transition">Privacy</Link></li>
          </ul>
        </div>
        <div className="border-l border-gray-700 pl-8 hidden md:block">
           <h3 className="text-gray-200 uppercase mb-4 font-semibold tracking-wide">Mail Us:</h3>
           <p className="mb-4">
             Flipkart Clone Private Limited,<br/>
             Buildings Alyssa, Begonia &<br/>
             Clove Embassy Tech Village,<br/>
             Outer Ring Road, Devarabeesanahalli Village,<br/>
             Bengaluru, 560103,<br/>
             Karnataka, India
           </p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs">
         <div className="flex gap-4 mb-4 md:mb-0">
            <span className="flex items-center gap-1"><span className="text-yellow-400">★</span> Advertise</span>
            <span className="flex items-center gap-1"><span className="text-yellow-400">★</span> Gift Cards</span>
            <span className="flex items-center gap-1"><span className="text-yellow-400">★</span> Help Center</span>
         </div>
         <div>
            © 2007-2026 Flipkart-Clone.com
         </div>
      </div>
    </footer>
  );
}
