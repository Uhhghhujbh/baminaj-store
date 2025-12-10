import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Package, RefreshCw, UserCheck } from 'lucide-react';

const Tracking = () => {
    const { isAdmin } = useAuth();
    const [scannedData, setScannedData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    // 1. SCAN HANDLER
    const handleScan = async (result) => {
        if (result && result[0]?.rawValue) {
            const code = result[0].rawValue;
            // Prevent duplicate scans of the same code immediately
            if (code === scannedData) return;
            
            setScannedData(code);
            fetchOrder(code);
        }
    };

    // 2. DATABASE LOOKUP
    const fetchOrder = async (orderId) => {
        setStatus('loading');
        try {
            const docRef = doc(db, "orders", orderId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setOrderData({ id: docSnap.id, ...docSnap.data() });
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    // 3. VALIDATION ACTION
    const validateOrder = async () => {
        if (!orderData) return;
        try {
            const docRef = doc(db, "orders", orderData.id);
            await updateDoc(docRef, {
                validated: true,
                status: 'completed',
                dispensedBy: 'Admin',
                dispensedAt: new Date()
            });
            alert("✅ Order Validated! You can release the items.");
            // Update local state to reflect change immediately
            setOrderData({ ...orderData, validated: true });
        } catch (error) {
            alert("Error validating order");
        }
    };

    // 4. RESET SCANNER
    const resetScanner = () => {
        setOrderData(null);
        setScannedData(null);
        setStatus('idle');
    };

    // SECURITY CHECK
    if (!isAdmin()) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 font-bold">
            RESTRICTED ACCESS
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20">
            <h1 className="text-xl font-serif font-bold text-center mb-6 text-luxury-gold uppercase tracking-widest">
                Admin Verification Terminal
            </h1>

            {/* SCANNER WINDOW */}
            {!orderData && (
                <div className="max-w-md mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
                    <div className="relative h-80">
                        <Scanner 
                            onScan={handleScan} 
                            components={{ audio: false, finder: false }} // Custom finder below
                            styles={{ container: { height: '100%' } }}
                        />
                        {/* Custom Overlay */}
                        <div className="absolute inset-0 border-[30px] border-black/50 z-10 pointer-events-none">
                            <div className="w-full h-full border-2 border-luxury-gold/50 relative animate-pulse">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-luxury-gold"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-luxury-gold"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-luxury-gold"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-luxury-gold"></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 text-center bg-gray-800">
                        <p className="text-sm text-gray-300 font-medium">Align User QR Code within frame</p>
                        {status === 'loading' && <p className="text-luxury-gold mt-2 animate-pulse">Processing...</p>}
                    </div>
                </div>
            )}

            {/* ERROR STATE */}
            {status === 'error' && (
                <div className="max-w-md mx-auto mt-10 text-center">
                    <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500 inline-block mb-4">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Invalid Ticket</h2>
                    <p className="text-gray-400 mb-6">This code does not exist in the database.</p>
                    <button onClick={resetScanner} className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200">
                        Try Again
                    </button>
                </div>
            )}

            {/* SUCCESS / VALIDATION STATE */}
            {orderData && (
                <div className="max-w-md mx-auto mt-4 bg-white text-black rounded-2xl p-6 shadow-2xl animate-slide-up">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Customer</p>
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <UserCheck size={20} className="text-luxury-gold" />
                                {orderData.userName}
                            </h3>
                            <p className="text-xs text-gray-500">{orderData.userEmail}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${orderData.validated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {orderData.validated ? 'Dispensed' : 'Pending'}
                        </div>
                    </div>

                    {/* Order List */}
                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Order Contents</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {orderData.items?.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm font-medium border-b border-gray-100 pb-1 last:border-0">
                                    <span>{item.quantity} x {item.name}</span>
                                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span>₦{orderData.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    {orderData.validated ? (
                        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200 mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                            <p className="text-green-800 font-bold">Verified & Dispensed</p>
                            <p className="text-xs text-green-600">at {orderData.dispensedAt?.toDate ? new Date(orderData.dispensedAt.toDate()).toLocaleTimeString() : 'Unknown Time'}</p>
                        </div>
                    ) : (
                        <button 
                            onClick={validateOrder}
                            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mb-4"
                        >
                            <CheckCircle /> CONFIRM & DISPENSE
                        </button>
                    )}

                    <button 
                        onClick={resetScanner}
                        className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} /> Scan Next Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tracking;