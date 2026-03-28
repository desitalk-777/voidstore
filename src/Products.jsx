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

  const handleBuy = (item) => {
    const phone = "91XXXXXXXXXX"; // 👈 Apna Number yahan dalo!
    const text = `*New Order from VoidStore* 🚀
----------------------------
*Product:* ${item.name}
*Price:* ₹${item.price}
*Details:* ${item.description || 'Premium Service'}
----------------------------
Bhai, is this available?`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.category?.toLowerCase() === filter);

  return (
    <div style={{ padding: '0 8% 100px' }}>
      
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '50px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['all', 'gaming', 'ott', 'ai'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: '10px 24px', borderRadius: '30px', border: 'none', background: filter === cat ? '#a855f7' : 'rgba(255,255,255,0.05)', color: filter === cat ? '#fff' : '#888', cursor: 'pointer', fontWeight: 'bold' }}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {filteredItems.map(item => (
          <div key={item.id} className="glass" style={{ padding: '25px', position: 'relative', opacity: item.stock > 0 ? 1 : 0.7 }}>
            
            {/* Stock Badge */}
            <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '4px 10px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold', background: item.stock > 0 ? '#22c55e' : '#ef4444' }}>
              {item.stock > 0 ? `STOCK: ${item.stock}` : "SOLD OUT"}
            </div>

            <div style={{ width: '100%', height: '180px', background: '#111', borderRadius: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={item.image} alt={item.name} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} />
            </div>

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#a855f7', fontSize: '11px', fontWeight: '800' }}>{item.category?.toUpperCase()}</span>
              <h3 style={{ fontSize: '22px', margin: '10px 0', fontWeight: '700', color: '#fff' }}>{item.name}</h3>
              <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '15px', minHeight: '40px' }}>{item.description}</p>
              <h2 style={{ fontSize: '26px', marginBottom: '20px', color: '#00ffff', fontWeight: '900' }}>₹{item.price}</h2>
            </div>
            
            <button 
              disabled={item.stock <= 0}
              onClick={() => handleBuy(item)} 
              className="buy-btn"
              style={{ background: item.stock > 0 ? '#fff' : '#333', cursor: item.stock > 0 ? 'pointer' : 'not-allowed' }}
            >
              {item.stock > 0 ? "BUY NOW" : "OUT OF STOCK"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}