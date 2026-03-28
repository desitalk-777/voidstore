import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot, query, limit } from 'firebase/firestore';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // ⚡ Optimization: Limit initial fetch and use onSnapshot for speed
    const q = query(collection(db, "products"), limit(20));
    
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setItems(data);
      setLoading(false); // Data aate hi loading off
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🚀 useMemo helps in faster filtering without re-rendering everything
  const filteredItems = useMemo(() => {
    return filter === 'all' ? items : items.filter(i => i.category?.toLowerCase() === filter);
  }, [filter, items]);

  const handleBuy = (item) => {
    const phone = "919596491283"; 
    const text = `Hey! I'm interested in buying:
*Product:* ${item.name}
*Price:* ₹${item.price}
*Details:* ${item.description || "Premium Access"}

Is this still available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ padding: '0 8% 100px' }} className="page-fade">
      
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '50px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['all', 'gaming', 'ott'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ 
              padding: '10px 24px', borderRadius: '30px', border: 'none', 
              background: filter === cat ? '#a855f7' : 'rgba(255,255,255,0.05)', 
              color: filter === cat ? '#fff' : '#888', cursor: 'pointer', fontWeight: 'bold'
            }}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🛒 Grid with Loading State */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        
        {loading ? (
          // 💀 Skeleton Loader: Dikhne mein fast lagta hai
          [1, 2, 3].map(n => (
            <div key={n} className="glass" style={{ padding: '25px', height: '400px', opacity: 0.3, animate: 'pulse 1.5s infinite' }}>
              <div style={{ width: '100%', height: '180px', background: '#222', borderRadius: '15px' }}></div>
              <div style={{ width: '60%', height: '20px', background: '#222', marginTop: '20px' }}></div>
              <div style={{ width: '100%', height: '40px', background: '#222', marginTop: '10px' }}></div>
            </div>
          ))
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="glass" style={{ padding: '25px' }}>
              {/* Image Box */}
              <div style={{ width: '100%', height: '180px', background: '#111', borderRadius: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={item.image || "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"} 
                  alt={item.name} loading="lazy" // ⚡ Lazy loading images
                  style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} 
                />
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#a855f7', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>{item.category}</span>
                <h3 style={{ fontSize: '22px', margin: '10px 0', fontWeight: '700', color: '#fff' }}>{item.name}</h3>
                <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '15px', minHeight: '40px' }}>{item.description}</p>
                <h2 style={{ fontSize: '26px', marginBottom: '20px', color: '#00ffff', fontWeight: '900' }}>₹{item.price}</h2>
              </div>
              
              <button onClick={() => handleBuy(item)} className="buy-btn">BUY NOW</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}