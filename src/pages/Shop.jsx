import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Flame, Utensils, Hammer, Loader2, Check } from 'lucide-react';
import { useCart } from '../context/CartContext'; // <--- Now Connected

const Shop = () => {
    const { addToCart } = useCart(); // <--- Cart Hook
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    
    // Auto-select category from URL
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('cat');
        if (cat) setActiveCategory(cat);
        fetchProducts();
    }, [location]);

    const fetchProducts = async () => {
        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProducts(items);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            // Fallback if index missing
            const querySnapshot = await getDocs(collection(db, "products"));
            const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProducts(items);
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        alert(`✅ Added ${product.name} to cart!`); // Simple feedback
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { id: 'all', label: 'All Collection', icon: null },
        { id: 'gas', label: 'Cooking Gas', icon: Flame },
        { id: 'utensils', label: 'Luxury Utensils', icon: Utensils },
        { id: 'fittings', label: 'Kitchen Fittings', icon: Hammer },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 text-luxury-gold animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HEADER */}
            <div className="bg-luxury-black text-white py-12 px-6">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-serif font-bold mb-2 text-luxury-gold">The Atelier Shop</h1>
                    <p className="text-gray-400">Premium gas, tools, and fittings for the modern home.</p>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="container mx-auto px-6 -mt-8">
                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                        <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search for items..." 
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                                    activeCategory === cat.id 
                                    ? 'bg-luxury-gold text-luxury-black shadow-md' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat.icon && <cat.icon size={16} />}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="container mx-auto px-6 mt-12">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">No products found</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition group border border-gray-100">
                                <div className="h-64 overflow-hidden relative bg-gray-100">
                                    <img 
                                        src={product.image || "https://via.placeholder.com/300"} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                    <span className="absolute top-4 left-4 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-md">
                                        {product.category}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">{product.desc}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xl font-serif font-bold text-luxury-gold">
                                            ₦{product.price?.toLocaleString()}
                                        </span>
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            className="bg-luxury-black text-white p-3 rounded-full hover:bg-luxury-gold hover:text-black transition shadow-lg transform active:scale-95"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;