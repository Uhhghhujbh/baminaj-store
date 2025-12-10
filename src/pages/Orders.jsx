import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Loader2, Calendar } from 'lucide-react';

const Orders = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !currentUser) {
            navigate('/login');
            return;
        }

        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser, authLoading]);

    const fetchOrders = async () => {
        try {
            // Fetch orders where userId matches current user
            const q = query(
                collection(db, "orders"), 
                where("userId", "==", currentUser.uid),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(userOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
        setLoading(false);
    };

    if (loading || authLoading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin w-8 h-8 text-luxury-gold" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-serif font-bold text-luxury-black mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl shadow text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Start your collection today.</p>
                        <Link to="/shop" className="bg-luxury-gold text-black px-6 py-2 rounded font-bold">Go to Shop</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition">
                                
                                <div className="flex items-start gap-4 w-full md:w-auto">
                                    <div className={`p-3 rounded-full ${order.validated ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-lg text-gray-800">Order #{order.id.slice(0, 6)}...</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${order.validated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {order.validated ? 'Collected' : 'Pending Pickup'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'Date N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.items.length} Items • Total: <span className="font-bold text-luxury-gold">₦{order.totalAmount.toLocaleString()}</span>
                                        </p>
                                    </div>
                                </div>

                                <Link 
                                    to={`/receipt/${order.id}`}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-bold text-sm hover:bg-luxury-black hover:text-white hover:border-black transition"
                                >
                                    View Receipt <ArrowRight size={16} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;