import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowLeft, Crown } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await login();
            // Redirect based on user role? For now, go to Admin to check access
            navigate('/admin');
        } catch (error) {
            alert("Login Failed: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-luxury-gold rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[100px]"></div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-2xl shadow-2xl max-w-md w-full relative z-10 text-center">
                
                <button 
                    onClick={() => navigate('/')} 
                    className="absolute top-4 left-4 text-gray-400 hover:text-white transition"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="w-24 h-24 bg-luxury-gold rounded-2xl rotate-6 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gold/20 border-4 border-white/10">
    <Crown size={48} className="text-luxury-black" strokeWidth={2} />
</div>

                <h1 className="text-3xl font-serif text-white mb-2">Welcome Back</h1>
                <p className="text-gray-400 mb-8">Sign in to access Baminaj Services</p>

                <button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-luxury-black font-bold py-4 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-3 shadow-xl group"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G" />
                    <span>Continue with Google</span>
                </button>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} /> Secured by Firebase Auth
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;