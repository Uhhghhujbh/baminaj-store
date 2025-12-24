import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Package, RefreshCw, UserCheck } from 'lucide-react';

const Tracking = () => {
    const { isAdmin, currentUser } = useAuth();
    const [scannedData, setScannedData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleScan = async (result) => {
        if (result && result[0]?.rawValue) {
            const code = result[0].rawValue;
            if (code === scannedData) return;
            setScannedData(code);
            fetchOrder(code);
        }
    };

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

    const validateOrder = async () => {
        if (!orderData) return;
        
        // SECURITY: Double check status in DB before update to prevent race conditions
        try {
            const docRef = doc(db, "orders", orderData.id);
            const freshSnap = await getDoc(docRef);
            
            if (freshSnap.data().validated) {
                alert("⚠️ Order was already dispensed by " + freshSnap.data().dispensedBy);
                setOrderData({ id: freshSnap.id, ...freshSnap.data() });
                return;
            }

            await updateDoc(docRef, {
                validated: true,
                status: 'completed',
                dispensedBy: currentUser?.email || 'Admin', // AUDIT LOG
                dispensedAt: serverTimestamp()
            });
            
            alert("✅ Order Validated! Release items.");
            setOrderData({ ...orderData, validated: true });
        } catch (error) {
            alert("Error validating: " + error.message);
        }
    };

    const resetScanner = () => {
        setOrderData(null);
        setScannedData(null);
        setStatus('idle');
    };

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

            {/* SCANNER */}
            {!orderData && (
                <div className="max-w-md mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
                    <div className="relative h-80">
                        <Scanner 
                            onScan={handleScan} 
                            components={{ audio: false, finder: false }} 
                            styles={{ container: { height: '100%' } }}
                        />
                        <div className="absolute inset-0 border-[30px] border-black/50 z-10 pointer-events-none"></div>
                    </div>
                    <div className="p-6 text-center bg-gray-800">
                        <p className="text-sm text-gray-300">Align Order QR Code</p>
                        {status === 'loading' && <p className="text-luxury-gold mt-2 animate-pulse">Searching Database...</p>}
                    </div>
                </div>
            )}

            {/* ERROR */}
            {status === 'error' && (
                <div className="max-w-md mx-auto mt-10 text-center">
                    <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500 inline-block mb-4">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-500">Invalid Order</h2>
                    <button onClick={resetScanner} className="mt-6 bg-white text-black px-8 py-3 rounded-xl font-bold">Try Again</button>
                </div>
            )}

            {/* ORDER DETAILS */}
            {orderData && (
                <div className="max-w-md mx-auto mt-4 bg-white text-black rounded-2xl p-6 shadow-2xl">
                    <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Customer</p>
                            <h3 className="font-bold text-xl">{orderData.userName}</h3>
                            <p className="text-xs text-gray-500">{orderData.userEmail}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${orderData.validated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {orderData.validated ? 'Dispensed' : 'Pending'}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {orderData.items?.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm font-medium border-b border-gray-100 pb-1">
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

                    {orderData.validated ? (
                        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200 mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                            <p className="text-green-800 font-bold">Dispensed by {orderData.dispensedBy}</p>
                        </div>
                    ) : (
                        <button onClick={validateOrder} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition mb-4">
                            CONFIRM & DISPENSE
                        </button>
                    )}

                    <button onClick={resetScanner} className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200">
                        Scan Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tracking;
