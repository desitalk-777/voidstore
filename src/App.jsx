import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Zap, Monitor, Gamepad2, Search, Play, Music, LayoutGrid } from 'lucide-react';

const PRODUCTS = [
  // GAMING CATEGORY
  { id: 1, type: "Gaming", game: "BGMI", title: "M416 Glacier Max + Conqueror", price: "₹12,499", tier: "Mythic", icon: <Gamepad2 className="text-orange-500" /> },
  { id: 2, type: "Gaming", game: "Minecraft", title: "OG 2011 Account + Minecon Cape", price: "₹8,000", tier: "Legendary", icon: <Monitor className="text-green-500" /> },
  { id: 3, type: "Gaming", game: "Valorant", title: "Radiant | VCT Lock-In Knife", price: "₹15,500", tier: "Immortal", icon: <Zap className="text-red-500" /> },
  
  // OTT CATEGORY
  { id: 4, type: "OTT", game: "Netflix", title: "UHD 4K Premium - 1 Month", price: "₹199", tier: "Personal", icon: <Play className="text-red-600" /> },
  { id: 5, type: "OTT", game: "Spotify", title: "Premium Family Plan - 6 Months", price: "₹499", tier: "Ad-Free", icon: <Music className="text-green-400" /> },
  { id: 6, type: "OTT", game: "Crunchyroll", title: "Mega Fan Account - 1 Year", price: "₹899", tier: "Premium", icon: <Play className="text-orange-400" /> },
];

function App() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProducts = PRODUCTS.filter(p => 
    (filter === "All" || p.type === filter) && 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full" />
      </div>

      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={22} fill="white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Void<span className="text-blue-500">Store</span></h1>
        </div>

        {/* Category Toggle */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
          {["All", "Gaming", "OTT"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all ${filter === tab ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 gap-3 focus-within:border-blue-500 transition-all">
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-transparent border-none outline-none text-sm w-48"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-[10px] flex items-center justify-center font-bold italic">0</span>
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="py-20 px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-white via-white to-blue-500 bg-clip-text text-transparent italic"
        >
          ULTIMATE DIGITAL MARKET.
        </motion.h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">High-tier gaming accounts & premium OTT subscriptions at the lowest prices.</p>
      </header>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] p-6 hover:border-blue-500/50 transition-all shadow-2xl overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-blue-500/10 transition-colors">
                    {product.type === "Gaming" ? <Gamepad2 size={80} /> : <LayoutGrid size={80} />}
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                      {product.icon}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.type === "Gaming" ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"}`}>
                      {product.type}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-gray-500 mb-2">{product.game}</p>
                  <h3 className="text-xl font-bold mb-8 group-hover:text-white transition-colors">{product.title}</h3>

                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Starting From</p>
                      <p className="text-2xl font-black text-white">{product.price}</p>
                    </div>
                    <button className="bg-white text-black h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform active:scale-90">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <p className="text-gray-600 text-xs tracking-widest uppercase">
          VoidStore Terminal v2.0 • Hosted on <span className="text-blue-500">Vercel</span>
        </p>
      </footer>
    </div>
  );
}

export default App;