import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash, Image as ImageIcon, Package, Loader2, DollarSign } from 'lucide-react';

const Admin = () => {
    const { isAdmin, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [newItem, setNewItem] = useState({
        name: '', 
        price: '', 
        desc: '', 
        image: '', 
        category: 'gas' // Default category
    });

    // Fetch Products on Mount
    useEffect(() => {
        if (isAdmin()) {
            fetchProducts();
        }
    }, [isAdmin]);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProducts(items);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return alert("Please fill details");
        setSubmitting(true);

        try {
            await addDoc(collection(db, "products"), {
                ...newItem,
                price: parseFloat(newItem.price), // Ensure number
                createdAt: serverTimestamp()
            });
            alert("✅ Product Added to Baminaj Inventory!");
            setNewItem({ name: '', price: '', desc: '', image: '', category: 'gas' });
            fetchProducts();
        } catch (error) {
            console.error("Error adding:", error);
            alert("Failed to add product");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this item?")) {
            await deleteDoc(doc(db, "products", id));
            fetchProducts();
        }
    };

    // Protection Check
    if (authLoading) return <div className="p-20 text-center">Checking permissions...</div>;
    if (!isAdmin()) return <div className="p-20 text-center text-red-600 font-bold">ACCESS DENIED. ADMINS ONLY.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-luxury-black">Manager Dashboard</h1>
                        <p className="text-gray-500">Manage Inventory & Gas Prices</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded shadow border border-gray-200">
                        <span className="text-xs text-gray-500 uppercase font-bold block">Total Items</span>
                        <span className="text-2xl font-bold text-luxury-gold">{products.length}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT: ADD PRODUCT FORM */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-luxury-gold">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="text-luxury-gold" /> Add New Item
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                                    <input 
                                        type="text" placeholder="e.g. 12.5kg Gas Refill" 
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-luxury-gold transition"
                                        value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₦)</label>
                                        <input 
                                            type="number" placeholder="0.00" 
                                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-luxury-gold transition"
                                            value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                        <select 
                                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-luxury-gold transition bg-white"
                                            value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                                        >
                                            <option value="gas">Gas Refill</option>
                                            <option value="utensils">Utensils & Cookware</option>
                                            <option value="fittings">Kitchen Fittings</option>
                                            <option value="appliances">Appliances</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image Link</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                        <input 
                                            type="url" placeholder="https://..." 
                                            className="w-full border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:border-luxury-gold transition"
                                            value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})}
                                        />
                                    </div>
                                    {newItem.image && (
                                        <div className="mt-2 h-32 w-full bg-gray-100 rounded overflow-hidden border border-gray-200">
                                            <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src='https://via.placeholder.com/150?text=Invalid+Link'}/>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea 
                                        rows="3" placeholder="Product details..." 
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-luxury-gold transition"
                                        value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})}
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full bg-luxury-black text-luxury-gold font-bold py-4 rounded hover:bg-gray-800 transition flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : <Plus />}
                                    Add to Inventory
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: INVENTORY LIST */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <h2 className="font-bold text-lg text-gray-700 flex items-center gap-2">
                                    <Package className="text-luxury-gold" /> Current Stock
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold">
                                        <tr>
                                            <th className="p-4">Product</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">Loading Inventory...</td></tr>
                                        ) : products.length === 0 ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">Inventory is empty.</td></tr>
                                        ) : (
                                            products.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                                    <td className="p-4 flex items-center gap-4">
                                                        <img 
                                                            src={item.image || 'https://via.placeholder.com/50'} 
                                                            alt={item.name} 
                                                            className="w-12 h-12 rounded object-cover border border-gray-200"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-gray-800">{item.name}</div>
                                                            <div className="text-xs text-gray-400 truncate max-w-[150px]">{item.desc}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                                            item.category === 'gas' ? 'bg-orange-100 text-orange-700' : 
                                                            item.category === 'utensils' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                                                        }`}>
                                                            {item.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-bold text-gray-700">
                                                        ₦{item.price?.toLocaleString()}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button 
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;