import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setItems(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleBuy = (item) => {
    const phone = "919596491283"; // Apna real number dalo
    const text = `*Order Request* 🛒\n*Product:* ${item.name}\n*Price:* ₹${item.price}\n*Details:* ${item.description}\n\nBhai, stock mein hai?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.category?.toLowerCase() === filter);

  return (
    <div style={{ padding: '0 8% 100px' }}>
      
      {/* Categories */}
      <div style={{ display: 'flex', gap: '10px', margin: '40px 0', justifyContent: 'center' }}>
        {['all', 'gaming', 'ott', 'ai'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', background: filter === cat ? '#a855f7' : '#111', color: 'white', cursor: 'pointer' }}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        
        {/* 💀 Skeleton Loading Animation */}
        {loading ? [1, 2, 3].map(n => (
          <div key={n} className="glass skeleton" style={{ height: '400px', padding: '25px' }}></div>
        )) : (
          filteredItems.map(item => (
            <div key={item.id} className="glass" style={{ padding: '25px', position: 'relative', opacity: item.stock > 0 ? 1 : 0.6 }}>
              
              {/* Manual Stock Badge */}
              <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', background: item.stock > 0 ? '#22c55e' : '#ef4444' }}>
                {item.stock > 0 ? `IN STOCK: ${item.stock}` : "OUT OF STOCK"}
              </div>

              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={item.image} alt={item.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
              </div>

              <div style={{ margin: '20px 0' }}>
                <h3 style={{ fontSize: '20px' }}>{item.name}</h3>
                <p style={{ color: '#aaa', fontSize: '12px', margin: '10px 0' }}>{item.description}</p>
                <h2 style={{ color: '#00ffff' }}>₹{item.price}</h2>
              </div>
              
              <button 
                disabled={item.stock <= 0}
                onClick={() => handleBuy(item)} 
                className="buy-btn"
                style={{ background: item.stock > 0 ? '#fff' : '#222', cursor: item.stock > 0 ? 'pointer' : 'not-allowed' }}
              >
                {item.stock > 0 ? "BUY NOW" : "SOLD OUT"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}