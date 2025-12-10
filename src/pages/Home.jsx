import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Utensils, Hammer, ArrowRight, ShieldCheck } from 'lucide-react';

const Home = () => {
    return (
        <div>
            {/* HERO SECTION */}
            <section className="relative h-[80vh] flex items-center justify-center bg-luxury-black overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                     {/* Placeholder background - Replace with Baminaj.jpg later if you want it as BG */}
                    <img 
    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
    alt="Luxury Kitchen" 
    className="w-full h-full object-cover opacity-50"
/>
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="inline-block py-1 px-3 border border-luxury-gold text-luxury-gold text-xs font-bold tracking-[0.2em] mb-6 uppercase">
                        Refined Home & Kitchen Atelier
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
                        Defined by <span className="text-luxury-gold italic">Elegance</span>. <br/> Powered by Reliability.
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Baminaj Signature Superstore is your premium destination for expert gas refilling, 
                        luxury cookware, and custom kitchen fittings.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/shop" className="bg-luxury-gold text-black px-8 py-4 rounded font-bold hover:bg-white transition shadow-lg flex items-center justify-center gap-2">
                            Shop Collections <ArrowRight size={20} />
                        </Link>
                        <Link to="/shop?cat=gas" className="border border-white text-white px-8 py-4 rounded font-bold hover:bg-white hover:text-black transition flex items-center justify-center gap-2">
                            <Flame size={20} /> Refill Gas
                        </Link>
                    </div>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Service 1 */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-2xl hover:shadow-gold/10 transition group">
                            <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center mb-6 group-hover:bg-luxury-gold transition">
                                <Flame className="text-white w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Gas Refilling Services</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We offer expert gas refilling services and supply high-quality cooking gas, ensuring households enjoy safe, reliable energy every day.
                            </p>
                        </div>

                        {/* Service 2 */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-2xl hover:shadow-gold/10 transition group">
                            <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center mb-6 group-hover:bg-luxury-gold transition">
                                <Utensils className="text-white w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Luxury Cookware</h3>
                            <p className="text-gray-600 leading-relaxed">
                                An exclusive range of kitchen utensils, cookware, appliances, and elegant kitchen accessories sourced to match modern and luxurious tastes.
                            </p>
                        </div>

                        {/* Service 3 */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-2xl hover:shadow-gold/10 transition group">
                            <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center mb-6 group-hover:bg-luxury-gold transition">
                                <Hammer className="text-white w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Custom Fittings</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Beautifully crafted kitchen frames, cupboards, shelves, and other custom fittings designed to upgrade any kitchen space with style and durability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BANNER */}
            <section className="bg-luxury-gold py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-serif font-bold text-luxury-black mb-6">Experience Quality, Comfort, & Class</h2>
                    <div className="flex flex-wrap justify-center gap-8 font-bold text-luxury-black/80">
                        <span className="flex items-center gap-2"><ShieldCheck /> Safe Energy</span>
                        <span className="flex items-center gap-2"><Utensils /> Premium Tools</span>
                        <span className="flex items-center gap-2"><Hammer /> Durable Fittings</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;