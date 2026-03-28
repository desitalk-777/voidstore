import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';

export default function Products() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setItems(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  // 🟢 Updated WhatsApp Function with Description
  const handleBuy = (item) => {
    const phone = "919596491283"; // Apna number yahan dalo
    
    // Message Format: Name, Price, and Description
    const text = `Hey! I'm interested in buying:
*Product:* ${item.name}
*Price:* ₹${item.price}
*Details:* ${item.description || "Premium Access"}

Is this still available?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.category?.toLowerCase() === filter);

  return (
    <div style={{ padding: '0 8% 100px' }} className="page-fade">
      
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '50px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['all', 'gaming', 'ott'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            style={{ 
              padding: '10px 24px', borderRadius: '30px', border: 'none', 
              background: filter === cat ? '#a855f7' : 'rgba(255,255,255,0.05)', 
              color: filter === cat ? '#fff' : '#888', 
              cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: '0.3s'
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {filteredItems.map(item => (
          <div key={item.id} className="glass" style={{ padding: '25px' }}>
            
            <div style={{ width: '100%', height: '180px', background: '#111', borderRadius: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img 
                src={item.image || "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"} 
                alt={item.name} 
                style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} 
              />
            </div>

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#a855f7', fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {item.category || "PREMIUM"}
              </span>

              <h3 style={{ fontSize: '22px', margin: '10px 0', fontWeight: '700', color: '#fff' }}>
                {item.name}
              </h3>

              {/* Description visible on Card */}
              <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.5', marginBottom: '15px', minHeight: '40px' }}>
                {item.description || "Official Discount • 4K • Instant Access"}
              </p>

              <h2 style={{ fontSize: '26px', marginBottom: '20px', color: '#00ffff', fontWeight: '900' }}>
                ₹{item.price}
              </h2>
            </div>
            
            {/* Click karne par ab description bhi jayegi */}
            <button 
              onClick={() => handleBuy(item)}
              className="buy-btn"
            >
              BUY NOW
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}