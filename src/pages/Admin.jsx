import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; 
import { Plus, Trash, Image as ImageIcon, Package, Loader2, QrCode, LogOut, Edit, Save, X, ShoppingBag, CheckCircle, Clock } from 'lucide-react';

const Admin = () => {
    const { isAdmin, loading: authLoading, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]); // Store customer orders
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'orders'
    const [editingProduct, setEditingProduct] = useState(null); // For the Edit Modal

    // Add Form State
    const [newItem, setNewItem] = useState({
        name: '', price: '', desc: '', image: '', category: 'gas'
    });

    useEffect(() => {
        if (isAdmin()) {
            fetchProducts();
            fetchOrders();
        }
    }, [isAdmin]);

    // --- DATA FETCHING ---
    const fetchProducts = async () => {
        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            // Handle case where index might not exist yet by falling back
            const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProducts(items);
        } catch (error) {
            // Fallback fetch if sort index fails
            const querySnapshot = await getDocs(collection(db, "products"));
            const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProducts(items);
        }
        setLoading(false);
    };

    const fetchOrders = async () => {
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const orderList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setOrders(orderList);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    // --- PRODUCT ACTIONS ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return alert("Please fill details");
        setSubmitting(true);

        try {
            await addDoc(collection(db, "products"), {
                ...newItem,
                price: parseFloat(newItem.price),
                createdAt: serverTimestamp()
            });
            alert("✅ Product Added!");
            setNewItem({ name: '', price: '', desc: '', image: '', category: 'gas' });
            fetchProducts();
        } catch (error) {
            alert("Failed to add product");
        }
        setSubmitting(false);
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        setSubmitting(true);
        try {
            const productRef = doc(db, "products", editingProduct.id);
            await updateDoc(productRef, {
                name: editingProduct.name,
                price: parseFloat(editingProduct.price),
                category: editingProduct.category,
                image: editingProduct.image,
                desc: editingProduct.desc,
                updatedAt: serverTimestamp()
            });
            alert("✅ Product Updated!");
            setEditingProduct(null); // Close modal
            fetchProducts();
        } catch (error) {
            alert("Error updating product");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this item?")) {
            await deleteDoc(doc(db, "products", id));
            fetchProducts();
        }
    };

    if (authLoading) return <div className="p-20 text-center">Checking permissions...</div>;
    if (!isAdmin()) return <div className="p-20 text-center text-red-600 font-bold">ACCESS DENIED. ADMINS ONLY.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                
                {/* 1. DASHBOARD HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-luxury-black">Manager Dashboard</h1>
                        <p className="text-gray-500">Baminaj Signature Superstore</p>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* Scanner Launch Button */}
                        <Link to="/track" className="flex items-center gap-2 bg-luxury-gold text-black px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-white hover:text-luxury-gold border-2 border-luxury-gold transition">
                            <QrCode size={20} />
                            Scanner
                        </Link>
                        <button onClick={logout} className="flex items-center gap-2 bg-white text-red-500 px-4 py-3 rounded-xl font-bold shadow hover:bg-red-50 transition border border-gray-200">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* 2. TABS */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
                    <button 
                        onClick={() => setActiveTab('inventory')}
                        className={`pb-3 px-4 font-bold transition relative ${activeTab === 'inventory' ? 'text-luxury-gold' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Inventory Management
                        {activeTab === 'inventory' && <div className="absolute bottom-0 left-0 w-full h-1 bg-luxury-gold rounded-t-md"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`pb-3 px-4 font-bold transition relative ${activeTab === 'orders' ? 'text-luxury-gold' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Incoming Orders ({orders.length})
                        {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-1 bg-luxury-gold rounded-t-md"></div>}
                    </button>
                </div>

                {/* --- VIEW 1: INVENTORY MANAGEMENT --- */}
                {activeTab === 'inventory' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Add Product Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-luxury-gold sticky top-24">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Plus className="text-luxury-gold" /> Add New Item
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                                        <input type="text" placeholder="e.g. 12.5kg Gas Refill" className="w-full border border-gray-300 p-3 rounded focus:border-luxury-gold focus:outline-none"
                                            value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₦)</label>
                                            <input type="number" placeholder="0.00" className="w-full border border-gray-300 p-3 rounded focus:border-luxury-gold focus:outline-none"
                                                value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                            <select className="w-full border border-gray-300 p-3 rounded focus:border-luxury-gold focus:outline-none bg-white"
                                                value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                                <option value="gas">Gas Refill</option>
                                                <option value="utensils">Utensils</option>
                                                <option value="fittings">Fittings</option>
                                                <option value="appliances">Appliances</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image Link (ImgBB)</label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                            <input type="url" placeholder="https://..." className="w-full border border-gray-300 p-3 pl-10 rounded focus:border-luxury-gold focus:outline-none"
                                                value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                        <textarea rows="3" placeholder="Product details..." className="w-full border border-gray-300 p-3 rounded focus:border-luxury-gold focus:outline-none"
                                            value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})}></textarea>
                                    </div>
                                    <button type="submit" disabled={submitting} className="w-full bg-luxury-black text-luxury-gold font-bold py-4 rounded hover:bg-gray-800 transition flex items-center justify-center gap-2">
                                        {submitting ? <Loader2 className="animate-spin" /> : <Plus />} Add to Inventory
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Inventory List */}
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
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {loading ? <tr><td colSpan="4" className="p-8 text-center text-gray-400">Loading...</td></tr> : 
                                            products.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                                    <td className="p-4 flex items-center gap-4">
                                                        <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 rounded object-cover border border-gray-200" />
                                                        <div>
                                                            <div className="font-bold text-gray-800">{item.name}</div>
                                                            <div className="text-xs text-gray-400 truncate max-w-[150px]">{item.desc}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4"><span className="text-xs font-bold px-2 py-1 rounded bg-gray-200 uppercase">{item.category}</span></td>
                                                    <td className="p-4 font-bold text-gray-700">₦{item.price?.toLocaleString()}</td>
                                                    <td className="p-4 text-right flex justify-end gap-2">
                                                        <button onClick={() => setEditingProduct(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded transition" title="Edit"><Edit size={18} /></button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded transition" title="Delete"><Trash size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW 2: ORDER MANAGEMENT --- */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-lg text-gray-700 flex items-center gap-2">
                                <ShoppingBag className="text-luxury-gold" /> Incoming Orders
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold">
                                    <tr>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Items</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-400">No orders yet.</td></tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                                <td className="p-4">
                                                    {order.validated ? (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded w-fit">
                                                            <CheckCircle size={12} /> COLLECTED
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded w-fit">
                                                            <Clock size={12} /> PENDING
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-xs font-mono text-gray-500">{order.id.slice(0, 8)}...</td>
                                                <td className="p-4">
                                                    <div className="text-sm font-bold text-gray-800">{order.userName}</div>
                                                    <div className="text-xs text-gray-400">{order.userEmail}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                                </td>
                                                <td className="p-4 font-bold text-luxury-gold">₦{order.totalAmount?.toLocaleString()}</td>
                                                <td className="p-4 text-xs text-gray-500">
                                                    {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- EDIT MODAL --- */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Edit Product</h2>
                                <button onClick={() => setEditingProduct(null)}><X className="text-gray-400 hover:text-black" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500">Product Name</label>
                                    <input className="w-full border p-2 rounded" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500">Price</label>
                                        <input type="number" className="w-full border p-2 rounded" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500">Category</label>
                                        <select className="w-full border p-2 rounded bg-white" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                                            <option value="gas">Gas Refill</option>
                                            <option value="utensils">Utensils</option>
                                            <option value="fittings">Fittings</option>
                                            <option value="appliances">Appliances</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500">Image URL</label>
                                    <input className="w-full border p-2 rounded" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500">Description</label>
                                    <textarea rows="3" className="w-full border p-2 rounded" value={editingProduct.desc} onChange={e => setEditingProduct({...editingProduct, desc: e.target.value})}></textarea>
                                </div>
                                <button onClick={handleUpdateProduct} disabled={submitting} className="w-full bg-luxury-gold text-black font-bold py-3 rounded hover:bg-yellow-500 transition flex justify-center gap-2">
                                    {submitting ? <Loader2 className="animate-spin" /> : <Save />} Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Admin;
