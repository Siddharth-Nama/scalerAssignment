import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Categories
        const catRes = await axios.get('categories/');
        setCategories(catRes.data);

        // Fetch Products with filters
        let url = 'products/';
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;

        const prodRes = await axios.get(url, { params });
        setProducts(prodRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (slug) => {
      if (selectedCategory === slug) {
          searchParams.delete('category');
      } else {
          searchParams.set('category', slug);
      }
      setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-2 py-4 flex gap-4">
      {/* Sidebar Filters */}
      <aside className="hidden md:block w-64 flex-shrink-0 bg-white p-4 shadow-sm h-fit sticky top-20">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Filters</h2>
        
        <div className="mb-6">
           <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Categories</h3>
           <ul className="space-y-2 text-sm">
             {categories.map(cat => (
               <li key={cat.id}>
                 <button 
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`w-full text-left hover:text-blue-600 flex items-center justify-between ${selectedCategory === cat.slug ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                 >
                   {cat.name}
                   {selectedCategory === cat.slug && <span>✓</span>}
                 </button>
               </li>
             ))}
           </ul>
        </div>
        
        {/* Price Range - Mock UI */}
         <div className="mb-6">
           <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Price</h3>
           <div className="h-1 bg-gray-200 rounded relative mt-4">
             <div className="absolute left-0 w-1/2 h-full bg-blue-600"></div>
             <div className="absolute left-0 w-4 h-4 bg-gray-100 border border-gray-400 rounded-full -top-1.5 shadow transform -translate-x-1/2"></div>
             <div className="absolute left-1/2 w-4 h-4 bg-gray-100 border border-gray-400 rounded-full -top-1.5 shadow transform -translate-x-1/2"></div>
           </div>
           <div className="flex justify-between text-xs text-gray-500 mt-2">
             <span>Min</span>
             <span>Max</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
         {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="h-80 bg-gray-200 rounded"></div>
             ))}
           </div>
         ) : (
           <>
              <div className="bg-white p-4 shadow-sm mb-4">
                 <h1 className="text-lg font-bold">
                    {searchQuery ? `Results for "${searchQuery}"` : 
                     selectedCategory ? `Products in ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}` : 
                     "Latest Products"}
                 </h1>
                 <span className="text-xs text-gray-500">(Showing {products.length} items)</span>
              </div>

              {products.length === 0 ? (
                  <div className="text-center py-20 bg-white">
                      <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
           </>
         )}
      </main>
    </div>
  );
}
