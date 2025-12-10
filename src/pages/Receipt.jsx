import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';
import { Printer, CheckCircle, Clock, MapPin, Crown, AlertCircle, ArrowLeft } from 'lucide-react';

const Receipt = () => {
    const { id } = useParams(); // Get the ID from the URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();

    // 1. REAL-TIME LISTENER (The "Magic Tick")
    // This watches the database. If Admin scans the code, this updates instantly.
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "orders", id), (doc) => {
            if (doc.exists()) {
                setOrder({ id: doc.id, ...doc.data() });
            }
            setLoading(false);
        });
        return () => unsub(); // Cleanup listener when leaving page
    }, [id]);

    // 2. PRINT FUNCTIONALITY
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Baminaj_Receipt_${id}`,
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-luxury-gold animate-pulse">
            Loading Secure Receipt...
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4"><AlertCircle className="text-red-600 w-8 h-8" /></div>
            <h1 className="text-xl font-bold text-gray-800">Receipt Not Found</h1>
            <p className="text-gray-500 mb-6">This order ID does not exist or has been deleted.</p>
            <Link to="/shop" className="text-luxury-gold hover:underline">Return to Shop</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
            <div className="max-w-md w-full space-y-6">
                
                {/* 1. BACK BUTTON */}
                <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-luxury-gold transition text-sm">
                    <ArrowLeft size={16} /> Back to My Orders
                </Link>

                {/* 2. LIVE STATUS CARD */}
                {order.validated ? (
                    <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg text-center animate-bounce border-2 border-green-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                        <h2 className="text-2xl font-bold uppercase tracking-wider">Collected</h2>
                        <p className="text-green-100 text-sm">Transaction Completed Successfully</p>
                    </div>
                ) : (
                    <div className="bg-luxury-gold text-black p-5 rounded-xl shadow-lg text-center border-2 border-yellow-400">
                        <div className="flex justify-center mb-2 animate-pulse"><Clock className="w-8 h-8" /></div>
                        <h2 className="font-bold uppercase tracking-wider text-xl">Ready for Pickup</h2>
                        <p className="text-sm font-medium opacity-80">Show the QR Code below at the counter</p>
                    </div>
                )}

                {/* 3. THE RECEIPT TICKET (Printable Area) */}
                <div ref={componentRef} className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-luxury-black relative overflow-hidden">
                    
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                        <Crown size={300} />
                    </div>

                    {/* Header */}
                    <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-6">
                        <div className="w-14 h-14 bg-luxury-black text-luxury-gold rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-luxury-gold">
                            <Crown size={32} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-serif font-bold uppercase text-gray-900 leading-none">Baminaj</h1>
                        <p className="text-xs text-luxury-gold font-bold uppercase tracking-[0.4em] mt-1">Signature Atelier</p>
                        
                        <div className="mt-4 text-xs text-gray-400">
                            <p>Date: {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString() : 'Just Now'}</p>
                            <p>Ref: {order.paymentRef || 'N/A'}</p>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center justify-center py-2 mb-6">
                        <div className="p-3 border-4 border-black rounded-xl">
                            <QRCode value={order.id} size={160} fgColor="#000000" />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 font-mono uppercase tracking-widest">ID: {order.id}</p>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3 mb-6 border-b-2 border-dashed border-gray-200 pb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Item Details</h3>
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-800 w-2/3">
                                    <span className="font-bold mr-2">{item.quantity}x</span> 
                                    {item.name}
                                </span>
                                <span className="font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="flex justify-between items-center mb-8">
                        <span className="font-bold text-gray-500 text-sm uppercase">Total Amount</span>
                        <span className="font-serif font-bold text-3xl text-luxury-black">₦{order.totalAmount.toLocaleString()}</span>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-500 flex gap-3 items-start border border-gray-100">
                        <MapPin className="w-5 h-5 shrink-0 text-luxury-gold" />
                        <div>
                            <p className="font-bold text-gray-700 mb-1">Pickup Location:</p>
                            <p>Baminaj Signature Superstore, Lagos.</p>
                            <p className="mt-1 italic">Please present a valid ID matching the name: <span className="font-bold">{order.userName}</span></p>
                        </div>
                    </div>
                </div>

                {/* 4. ACTION BUTTONS */}
                <button 
                    onClick={handlePrint}
                    className="w-full bg-luxury-black text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition transform hover:-translate-y-1"
                >
                    <Printer size={20} /> Save / Print Receipt
                </button>
            </div>
        </div>
    );
};

export default Receipt;