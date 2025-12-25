import React, { useState, useEffect } from 'react';
import { Flame, Utensils, Hammer, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

const Home = () => {
    // Background images carousel
    const backgroundImages = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showTerms, setShowTerms] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % backgroundImages.length
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleTermsClick = (e) => {
        e.preventDefault();
        setShowTerms(true);
    };

    if (showTerms) {
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="mb-8">
                        <button 
                            onClick={() => setShowTerms(false)}
                            className="text-luxury-gold hover:text-luxury-black transition font-bold"
                            style={{ color: '#D4AF37' }}
                        >
                            ← Back to Home
                        </button>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8" style={{ color: '#1a1a1a' }}>
                        Terms & Conditions of Use
                    </h1>
                    
                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
                                1. Acceptance of Terms
                            </h2>
                            <p className="leading-relaxed">
                                By accessing and using Baminaj Signature Superstore services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of our services immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
                                2. Services Provided
                            </h2>
                            <p className="leading-relaxed">
                                Baminaj Signature Superstore provides premium gas refilling services, luxury cookware retail, and custom kitchen fittings installation. All services are subject to availability and are provided in accordance with industry safety standards and regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
                                3. Gas Refilling Safety
                            </h2>
                            <p className="leading-relaxed">
                                Customers utilizing our gas refilling services must ensure their gas cylinders meet safety standards and are not damaged or expired. Baminaj reserves the right to refuse service to any cylinder that does not meet our safety requirements. Proper handling and storage instructions will be provided with every refill.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
                                4. Product Quality & Warranty
                            </h2>
                            <p className="leading-relaxed">
                                All cookware and kitchen products sold by Baminaj are sourced from reputable manufacturers. Warranty terms vary by product and manufacturer. Custom fittings come with our installation guarantee and craftsmanship warranty as specified at time of purchase.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
                                5. Payment & Pricing
                            </h2>
                            <p className="leading-relaxed">
                                All prices are subject to change without prior notice. Payment is due at time of service or purchase unless alternative arrangements have been made. We accept various payment methods as displayed at our physical location and online platforms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
                                6. Limitation of Liability
                            </h2>
                            <p className="leading-relaxed">
                                Baminaj Signature Superstore shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the purchase price of the product or service in question.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
                                7. Privacy & Data Protection
                            </h2>
                            <p className="leading-relaxed">
                                We respect your privacy and are committed to protecting your personal information. Customer data is collected and used solely for service delivery and business purposes, and will not be shared with third parties without consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
                                8. Contact Information
                            </h2>
                            <p className="leading-relaxed">
                                For questions regarding these Terms & Conditions, please contact Baminaj Signature Superstore through our official contact channels. We are committed to addressing all customer concerns promptly and professionally.
                            </p>
                        </section>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500 italic">
                                Last Updated: December 2024<br/>
                                © 2024 Baminaj Signature Superstore. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* HERO SECTION */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
                {/* Carousel Background */}
                <div className="absolute inset-0 z-0">
                    {backgroundImages.map((img, index) => (
                        <img 
                            key={index}
                            src={img}
                            alt={`Luxury Home ${index + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                index === currentImageIndex ? 'opacity-40' : 'opacity-0'
                            }`}
                        />
                    ))}
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">

                    <span className="inline-block py-1 px-3 border text-xs font-bold tracking-[0.2em] mb-6 uppercase" style={{ borderColor: '#D4AF37', color: '#D4AF37' }}>
                        Refined Home & Kitchen Atelier
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight px-2">
                        Defined by <span className="italic" style={{ color: '#D4AF37' }}>Elegance</span>. <br/> Powered by Reliability.
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4">
                        Baminaj Signature Superstore is your premium destination for expert gas refilling, 
                        luxury cookware, and custom kitchen fittings.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                        <button className="text-black px-6 md:px-8 py-3 md:py-4 rounded font-bold hover:bg-white transition shadow-lg flex items-center justify-center gap-2" style={{ backgroundColor: '#D4AF37' }}>
                            Shop Collections <ArrowRight size={20} />
                        </button>
                        <button className="border border-white text-white px-6 md:px-8 py-3 md:py-4 rounded font-bold hover:bg-white hover:text-black transition flex items-center justify-center gap-2">
                            <Flame size={20} /> Refill Gas
                        </button>
                    </div>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Service 1 */}
                        <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100 hover:shadow-2xl transition group" style={{ boxShadow: '0 0 0 0 rgba(212, 175, 55, 0)' }}>
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-6 transition" style={{ backgroundColor: '#1a1a1a' }}>
                                <Flame className="text-white w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 text-gray-900">Gas Refilling Services</h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                We offer expert gas refilling services and supply high-quality cooking gas, ensuring households enjoy safe, reliable energy every day.
                            </p>
                        </div>

                        {/* Service 2 */}
                        <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100 hover:shadow-2xl transition group">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-6 transition" style={{ backgroundColor: '#1a1a1a' }}>
                                <Utensils className="text-white w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 text-gray-900">Luxury Cookware</h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                An exclusive range of kitchen utensils, cookware, appliances, and elegant kitchen accessories sourced to match modern and luxurious tastes.
                            </p>
                        </div>

                        {/* Service 3 */}
                        <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100 hover:shadow-2xl transition group sm:col-span-2 lg:col-span-1">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-6 transition" style={{ backgroundColor: '#1a1a1a' }}>
                                <Hammer className="text-white w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 text-gray-900">Custom Fittings</h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                Beautifully crafted kitchen frames, cupboards, shelves, and other custom fittings designed to upgrade any kitchen space with style and durability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BANNER */}
            <section className="py-12 md:py-16" style={{ backgroundColor: '#D4AF37' }}>
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6" style={{ color: '#1a1a1a' }}>
                        Experience Quality, Comfort, & Class
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-bold text-sm md:text-base" style={{ color: 'rgba(26, 26, 26, 0.8)' }}>
                        <span className="flex items-center gap-2"><ShieldCheck size={20} /> Safe Energy</span>
                        <span className="flex items-center gap-2"><Utensils size={20} /> Premium Tools</span>
                        <span className="flex items-center gap-2"><Hammer size={20} /> Durable Fittings</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="text-white py-8 md:py-12" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center space-y-4">
                        <p className="text-gray-400 text-sm md:text-base">
                            © 2026 Baminaj Signature Superstore. All rights reserved.
                        </p>
                        <p className="font-semibold text-sm md:text-base flex items-center justify-center gap-2" style={{ color: '#D4AF37' }}>
                            <ExternalLink size={16} />
                            A LearnovaTech Collaboration
                        </p>
                        <div className="pt-4">
                            <button 
                                onClick={handleTermsClick}
                                className="text-gray-400 hover:text-luxury-gold transition underline text-sm md:text-base"
                            >
                                Terms & Conditions of Use
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
