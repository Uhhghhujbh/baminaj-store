import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { currentUser, logout, isAdmin } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop Gas & Utensils', path: '/shop' },
        { name: 'Track Order', path: '/track' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* SECURITY HEADERS */}
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                
                {/* Content Security Policy */}
                <meta httpEquiv="Content-Security-Policy" content="
                    default-src 'self'; 
                    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; 
                    style-src 'self' 'unsafe-inline'; 
                    img-src 'self' data: https: blob:; 
                    font-src 'self' data: https://fonts.gstatic.com; 
                    connect-src 'self' https://api.anthropic.com https://*.firebaseio.com https://*.googleapis.com; 
                    frame-ancestors 'none';
                " />
                
                {/* Security Headers */}
                <meta httpEquiv="X-Frame-Options" content="DENY" />
                <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
                <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
                <meta name="referrer" content="strict-origin-when-cross-origin" />
                
                {/* Permissions Policy */}
                <meta httpEquiv="Permissions-Policy" content="
                    camera=(), 
                    microphone=(), 
                    geolocation=(self), 
                    payment=(self)
                " />
                
                {/* Additional Security */}
                <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
            </Helmet>

            {/* TOP BAR (Gold) */}
            <div className="bg-luxury-gold text-luxury-black py-2 px-4 text-center text-xs font-bold tracking-widest uppercase">
                Premium Kitchen Atelier • Gas Refilling • Luxury Fittings
            </div>

            {/* NAVBAR (Black) */}
            <nav className="bg-luxury-black text-white shadow-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    
                    {/* LOGO AREA - Image Version */}
                    <Link to="/me" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-luxury-gold rounded-xl rotate-3 flex items-center justify-center shadow-lg group-hover:rotate-6 transition border-2 border-luxury-black overflow-hidden">
                            <img 
                                src="/baminaj.jpg" 
                                alt="Logo" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="text-luxury-black text-2xl font-bold">B</div>';
                                }}
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-extrabold tracking-wide text-white uppercase leading-none">Baminaj</h1>
                            <span className="text-[9px] text-luxury-gold block tracking-[0.3em] uppercase font-bold">Signature Atelier</span>
                        </div>
                    </Link>

                    {/* DESKTOP LINKS */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name}
                                to={link.path} 
                                className={`text-sm font-medium hover:text-luxury-gold transition-colors tracking-wide ${location.pathname === link.path ? 'text-luxury-gold' : 'text-gray-300'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* USER ACTIONS */}
                    <div className="hidden md:flex items-center gap-6">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                {isAdmin() && (
                                    <Link to="/me" className="flex items-center gap-1 text-xs font-bold text-luxury-gold border border-luxury-gold px-3 py-1 rounded hover:bg-luxury-gold hover:text-black transition">
                                        <ShieldCheck size={14} /> MANAGEMENT
                                    </Link>
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <User size={16} />
                                    <span>{currentUser.displayName?.split(' ')[0]}</span>
                                </div>
                                <button onClick={logout} className="text-gray-500 hover:text-red-400 transition" title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-luxury-gold text-luxury-black px-6 py-2 rounded font-bold text-sm hover:bg-white transition shadow-lg hover:shadow-gold/20">
                                Sign In
                            </Link>
                        )}
                        <Link to="/cart" className="relative text-white hover:text-luxury-gold transition">
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">0</span>
                        </Link>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* MOBILE DROPDOWN */}
                {isMenuOpen && (
                    <div className="md:hidden bg-luxury-charcoal border-t border-gray-800">
                        <div className="flex flex-col p-4 gap-4">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path} className="text-gray-300 hover:text-luxury-gold py-2 border-b border-gray-800" onClick={() => setIsMenuOpen(false)}>
                                    {link.name}
                                </Link>
                            ))}
                            {isAdmin() && (
                                <Link to="/me" className="text-luxury-gold font-bold py-2" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* MAIN CONTENT */}
            <main className="flex-grow">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-luxury-black text-white py-12 border-t border-luxury-gold/30">
                <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-xl font-serif text-luxury-gold mb-4">Baminaj Signature</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A premium one-stop destination for refined homes. Expert gas services, luxury cookware, and custom kitchen fittings.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/shop" className="hover:text-luxury-gold">Cooking Gas</Link></li>
                            <li><Link to="/shop" className="hover:text-luxury-gold">Kitchen Utensils</Link></li>
                            <li><Link to="/track" className="hover:text-luxury-gold">Track Order</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">Contact</h4>
                        <p className="text-sm text-gray-400">Lagos, Nigeria</p>
                        <p className="text-sm text-gray-400 mt-2">support@baminaj.com</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
