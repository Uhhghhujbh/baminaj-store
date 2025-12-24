import React, { useState, useEffect } from 'react';
import { Flame, Utensils, Hammer, ArrowRight, ShieldCheck, Award, Clock, MapPin, X } from 'lucide-react';

const Home = () => {
    const [showTerms, setShowTerms] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div>
            {/* HERO SECTION */}
            <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center bg-luxury-black overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img 
                        src="baminaj.jpg" 
                        alt="Baminaj Signature" 
                        className="w-full h-full object-cover opacity-50 animate-pulse"
                        style={{ animationDuration: '4s' }}
                    />
                </div>
                
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-luxury-gold/20 via-transparent to-luxury-black/40 animate-pulse" style={{ animationDuration: '3s' }}></div>
                
                <div className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="inline-block py-1 px-3 border border-luxury-gold text-luxury-gold text-xs sm:text-sm font-bold tracking-[0.2em] mb-4 sm:mb-6 uppercase animate-bounce" style={{ animationDuration: '2s' }}>
                        Refined Home & Kitchen Atelier
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-4 sm:mb-6 leading-tight px-2 animate-fade-in-up">
                        Defined by <span className="text-luxury-gold italic animate-pulse">Elegance</span>. <br className="hidden sm:block" /> 
                        <span className="sm:hidden"> </span>Powered by Reliability.
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        Baminaj Signature Superstore is your premium destination for expert gas refilling, 
                        luxury cookware, and custom kitchen fittings. Experience excellence in every detail.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <a href="/shop" className="bg-luxury-gold text-black px-6 sm:px-8 py-3 sm:py-4 rounded font-bold hover:bg-white hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base transform">
                            Shop Collections <ArrowRight size={18} className="sm:w-5 sm:h-5 animate-pulse" />
                        </a>
                        <a href="/shop?cat=gas" className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded font-bold hover:bg-white hover:text-black hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base transform">
                            <Flame size={18} className="sm:w-5 sm:h-5 animate-pulse" /> Refill Gas
                        </a>
                    </div>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl animate-float-delayed"></div>
                
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">Our Premium Services</h2>
                        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
                            Delivering exceptional quality and service across all our offerings
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                        {/* Service 1 */}
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-2xl hover:shadow-luxury-gold/20 hover:-translate-y-2 transition-all duration-500 group animate-slide-up">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-luxury-black rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-luxury-gold group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Flame className="text-white w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-luxury-gold transition-colors duration-300">Gas Refilling Services</h3>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                                We offer expert gas refilling services and supply high-quality cooking gas, ensuring households enjoy safe, reliable energy every day. Our certified technicians prioritize safety and efficiency in every service.
                            </p>
                            <div className="flex items-center gap-2 text-luxury-gold text-sm font-semibold group-hover:scale-105 transition-transform duration-300">
                                <ShieldCheck size={16} className="animate-pulse" /> Certified & Safe
                            </div>
                        </div>

                        {/* Service 2 */}
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-2xl hover:shadow-luxury-gold/20 hover:-translate-y-2 transition-all duration-500 group animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-luxury-black rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-luxury-gold group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Utensils className="text-white w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-luxury-gold transition-colors duration-300">Luxury Cookware</h3>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                                An exclusive range of kitchen utensils, cookware, appliances, and elegant kitchen accessories sourced to match modern and luxurious tastes. Each piece is carefully selected for quality and design.
                            </p>
                            <div className="flex items-center gap-2 text-luxury-gold text-sm font-semibold group-hover:scale-105 transition-transform duration-300">
                                <Award size={16} className="animate-pulse" /> Premium Quality
                            </div>
                        </div>

                        {/* Service 3 */}
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-2xl hover:shadow-luxury-gold/20 hover:-translate-y-2 transition-all duration-500 group sm:col-span-2 lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-luxury-black rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-luxury-gold group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Hammer className="text-white w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-luxury-gold transition-colors duration-300">Custom Fittings</h3>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                                Beautifully crafted kitchen frames, cupboards, shelves, and other custom fittings designed to upgrade any kitchen space with style and durability. Our expert craftsmen bring your vision to life.
                            </p>
                            <div className="flex items-center gap-2 text-luxury-gold text-sm font-semibold group-hover:scale-105 transition-transform duration-300">
                                <Clock size={16} className="animate-pulse" /> Expert Installation
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BANNER */}
            <section className="bg-luxury-gold py-12 sm:py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold via-yellow-500 to-luxury-gold animate-gradient"></div>
                <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-luxury-black mb-4 sm:mb-6 px-4 animate-fade-in-up">Experience Quality, Comfort, & Class</h2>
                    <p className="text-luxury-black/80 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4 animate-fade-in">
                        Your trusted partner for premium home and kitchen solutions
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 font-bold text-luxury-black/80 text-sm sm:text-base px-4">
                        <span className="flex items-center gap-2 hover:scale-110 transition-transform duration-300 animate-bounce-slow"><ShieldCheck size={18} className="sm:w-5 sm:h-5" /> Safe Energy</span>
                        <span className="flex items-center gap-2 hover:scale-110 transition-transform duration-300 animate-bounce-slow" style={{ animationDelay: '0.1s' }}><Utensils size={18} className="sm:w-5 sm:h-5" /> Premium Tools</span>
                        <span className="flex items-center gap-2 hover:scale-110 transition-transform duration-300 animate-bounce-slow" style={{ animationDelay: '0.2s' }}><Hammer size={18} className="sm:w-5 sm:h-5" /> Durable Fittings</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-luxury-black text-white py-8 sm:py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-gray-900 to-luxury-black opacity-50"></div>
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        <div className="animate-fade-in-up">
                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-luxury-gold">Baminaj Signature</h3>
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                Your premium destination for gas refilling, luxury cookware, and custom kitchen solutions.
                            </p>
                        </div>
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm sm:text-base">
                                <li><a href="/shop" className="text-gray-400 hover:text-luxury-gold hover:translate-x-2 inline-block transition-all duration-300">Shop</a></li>
                                <li><a href="/about" className="text-gray-400 hover:text-luxury-gold hover:translate-x-2 inline-block transition-all duration-300">About Us</a></li>
                                <li><a href="/contact" className="text-gray-400 hover:text-luxury-gold hover:translate-x-2 inline-block transition-all duration-300">Contact</a></li>
                                <li>
                                    <button 
                                        onClick={() => setShowTerms(true)} 
                                        className="text-gray-400 hover:text-luxury-gold hover:translate-x-2 transition-all duration-300 text-left"
                                    >
                                        Terms & Conditions
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact Info</h3>
                            <p className="text-gray-400 flex items-start gap-2 text-sm sm:text-base">
                                <MapPin size={18} className="mt-1 flex-shrink-0 animate-pulse" /> 
                                <span>Visit us for quality products and services</span>
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center animate-fade-in">
                        <p className="text-gray-400 text-xs sm:text-sm mb-2">
                            &copy; {new Date().getFullYear()} Baminaj Signature Superstore. All rights reserved.
                        </p>
                        <p className="text-luxury-gold text-xs sm:text-sm font-semibold animate-pulse">
                            A LearnovaTech Collaboration
                        </p>
                    </div>
                </div>
            </footer>

            {/* TERMS & CONDITIONS MODAL */}
            {showTerms && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
                    <div className="bg-white rounded-xl max-w-4xl w-full my-8 relative animate-scale-up">
                        <button 
                            onClick={() => setShowTerms(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:rotate-90 transition-all duration-300 z-10"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="p-6 sm:p-8 md:p-12">
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-black mb-6 animate-fade-in-up">Terms & Conditions</h1>
                            
                            <div className="space-y-6 text-gray-700 text-sm sm:text-base">
                                <section className="animate-fade-in-up">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                                    <p className="leading-relaxed">
                                        Welcome to Baminaj Signature Superstore. By accessing or using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before using our platform or purchasing our products.
                                    </p>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">2. Services Offered</h2>
                                    <p className="leading-relaxed mb-2">
                                        Baminaj Signature Superstore provides the following services:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Gas refilling and supply services</li>
                                        <li>Sale of luxury cookware and kitchen appliances</li>
                                        <li>Custom kitchen fittings and installations</li>
                                    </ul>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">3. Product Quality & Safety</h2>
                                    <p className="leading-relaxed">
                                        All products sold and services rendered by Baminaj Signature meet industry safety standards. Gas refilling services are conducted by certified technicians following strict safety protocols. We guarantee the authenticity and quality of all cookware and kitchen products.
                                    </p>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">4. Payment Terms</h2>
                                    <p className="leading-relaxed">
                                        Payment is required at the time of purchase or service delivery unless otherwise agreed upon. We accept various payment methods including cash, bank transfers, and digital payments. All prices are subject to change without prior notice.
                                    </p>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">5. Returns & Refunds</h2>
                                    <p className="leading-relaxed">
                                        Returns are accepted within 7 days of purchase for unopened products in original packaging. Gas cylinders and custom-fitted items are non-returnable unless defective. Refunds will be processed within 14 business days of approved returns.
                                    </p>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">6. Warranty</h2>
                                    <p className="leading-relaxed">
                                        Products come with manufacturer warranties where applicable. Custom fittings include a 6-month workmanship warranty. Gas equipment is covered according to manufacturer specifications.
                                    </p>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">7. Liability</h2>
                                    <p className="leading-relaxed">
                                        Baminaj Signature Superstore is not liable for damages resulting from improper use of products or failure to follow safety instructions. Users are responsible for proper handling and storage of gas cylinders and equipment.
                                    </p>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">8. Privacy Policy</h2>
                                    <p className="leading-relaxed">
                                        We respect your privacy and protect your personal information. Data collected during transactions is used solely for service delivery and improvement purposes and will not be shared with third parties without consent.
                                    </p>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">9. Modifications</h2>
                                    <p className="leading-relaxed">
                                        Baminaj Signature Superstore reserves the right to modify these terms and conditions at any time. Continued use of our services constitutes acceptance of any changes.
                                    </p>
                                </section>

                                <section className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">10. Contact Information</h2>
                                    <p className="leading-relaxed">
                                        For questions or concerns regarding these terms, please contact us through our official channels. We are committed to addressing all inquiries promptly and professionally.
                                    </p>
                                </section>

                                <div className="bg-luxury-gold/10 border border-luxury-gold p-4 sm:p-6 rounded-lg mt-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                                    <p className="text-sm text-gray-600 text-center">
                                        Last Updated: {new Date().toLocaleDateString()}<br />
                                        <span className="text-luxury-gold font-semibold">A LearnovaTech Collaboration</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <button 
                                    onClick={() => setShowTerms(false)}
                                    className="bg-luxury-gold text-black px-8 py-3 rounded font-bold hover:bg-luxury-black hover:text-white hover:scale-105 transition-all duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes scale-up {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(20px); }
                }
                
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                }
                
                .animate-scale-up {
                    animation: scale-up 0.4s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                }
                
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 5s ease infinite;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Home;
