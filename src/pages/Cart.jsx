import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const Cart = () => {
    const { cart, removeFromCart, addToCart, decreaseQuantity, getCartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // Initial display total (client-side)
    const displayTotal = getCartTotal();

    // 1. FLUTTERWAVE CONFIGURATION (Hook requires config, but we will override amount in trigger)
    const config = {
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY, // Fix: Use Env Var
        tx_ref: Date.now(),
        amount: displayTotal, 
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: currentUser?.email || 'guest@baminaj.com',
            phone_number: '08100000000',
            name: currentUser?.displayName || 'Valued Customer',
        },
        customizations: {
            title: 'Baminaj Signature Store',
            description: 'Payment for items in cart',
            logo: 'https://tsquarealuminium.vercel.app/tsquare.jpg',
        },
    };

    const handleFlutterwavePayment = useFlutterwave(config);

    // 2. SECURE PAYMENT LOGIC
    const processPayment = async () => {
        if (!currentUser) {
            alert("Please Login to Checkout");
            navigate('/login');
            return;
        }

        setIsProcessing(true);

        try {
            // SECURITY CHECK: Re-calculate total from Database, not LocalStorage
            let serverTotal = 0;
            const verifiedItems = [];

            for (const item of cart) {
                const productRef = doc(db, "products", item.id);
                const productSnap = await getDoc(productRef);
                
                if (productSnap.exists()) {
                    const realPrice = productSnap.data().price;
                    serverTotal += realPrice * item.quantity;
                    verifiedItems.push({
                        ...item,
                        price: realPrice // Ensure stored order has real price
                    });
                } else {
                    alert(`Product ${item.name} is no longer available.`);
                    setIsProcessing(false);
                    return;
                }
            }

            // Trigger Flutterwave with the VERIFIED total
            handleFlutterwavePayment({
                ...config,
                amount: serverTotal, // Overwrite with secure total
                callback: async (response) => {
                    console.log(response);
                    closePaymentModal();
                    
                    if (response.status === "successful") {
                        try {
                            // 3. CREATE ORDER IN DATABASE
                            const orderData = {
                                userId: currentUser.uid,
                                userEmail: currentUser.email,
                                userName: currentUser.displayName,
                                items: verifiedItems, // Use verified items
                                totalAmount: serverTotal, // Use verified total
                                paymentRef: response.tx_ref,
                                transactionId: response.transaction_id,
                                status: 'pending_pickup',
                                createdAt: serverTimestamp(),
                                validated: false
                            };

                            const docRef = await addDoc(collection(db, "orders"), orderData);
                            
                            clearCart();
                            navigate(`/receipt/${docRef.id}`);
                            
                        } catch (error) {
                            console.error("Order Creation Error:", error);
                            alert("Payment successful but order creation failed. Contact Admin.");
                        }
                    } else {
                        alert("Payment Failed. Please try again.");
                    }
                    setIsProcessing(false);
                },
                onClose: () => {
                    setIsProcessing(false);
                    alert("Payment Cancelled");
                },
            });

        } catch (error) {
            console.error("Security Check Failed:", error);
            alert("Error validating prices. Please try again.");
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Browse our luxury collection to find something unique.</p>
                    <Link to="/shop" className="bg-luxury-gold text-luxury-black font-bold py-3 px-8 rounded-xl hover:bg-black hover:text-luxury-gold transition shadow-lg inline-block">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-800">Verifying Prices & Securing Receipt...</h2>
                    <p className="text-gray-500">Please do not close this window.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-serif font-bold text-luxury-black mb-8">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* CART ITEMS LIST */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <img 
                                    src={item.image || "https://via.placeholder.com/100"} 
                                    alt={item.name} 
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                    <p className="font-serif font-bold text-luxury-gold">₦{item.price.toLocaleString()}</p>
                                </div>
                                
                                <div className="flex flex-col items-end gap-3">
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-400 hover:text-red-600 transition"
                                    >
                                        <Trash size={18} />
                                    </button>
                                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                        <button 
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => addToCart(item)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CHECKOUT SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-luxury-gold sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
                            
                            <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₦{displayTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Service Fee</span>
                                    <span>₦0.00</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-serif font-bold text-luxury-gold">₦{displayTotal.toLocaleString()}</span>
                            </div>

                            {!currentUser ? (
                                <Link to="/login" className="block w-full bg-gray-900 text-white text-center font-bold py-4 rounded-xl hover:bg-black transition">
                                    Login to Checkout
                                </Link>
                            ) : (
                                <button 
                                    onClick={processPayment}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
                                >
                                    Pay Now <ArrowRight size={20} />
                                </button>
                            )}

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <ShieldCheck size={14} />
                                <span>Secured by Flutterwave</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
