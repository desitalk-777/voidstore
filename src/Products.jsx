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

  const filteredItems = filter === 'all' ? items : items.filter(i => i.category?.toLowerCase() === filter);

  return (
    <div className="page-fade" style={{ padding: '0 8% 100px' }}>
      
      <div style={{ display: 'flex', gap: '10px', margin: '40px 0', justifyContent: 'center' }}>
        {['all', 'gaming', 'ott', 'ai'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', background: filter === cat ? '#a855f7' : '#111', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {loading ? [1, 2, 3].map(n => (
          <div key={n} className="skeleton-card"></div>
        )) : (
          filteredItems.map(item => (
            <div key={item.id} className="glass" style={{ padding: '25px', position: 'relative', opacity: item.stock > 0 ? 1 : 0.6 }}>
              <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold', background: item.stock > 0 ? '#22c55e' : '#ef4444' }}>
                {item.stock > 0 ? `IN STOCK: ${item.stock}` : "OUT OF STOCK"}
              </div>
              
              {/* Product Info & Buy Button same as before */}
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={item.image} alt={item.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '22px', marginTop: '15px' }}>{item.name}</h3>
              <p style={{ color: '#aaa', fontSize: '13px', margin: '10px 0' }}>{item.description}</p>
              <h2 style={{ color: '#00ffff' }}>₹{item.price}</h2>
              <button disabled={item.stock <= 0} onClick={() => window.open(`https://wa.me/919596491283?text=I want ${item.name}`)} className="buy-btn" style={{ width: '100%', marginTop: '15px', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', background: item.stock > 0 ? '#fff' : '#222' }}>
                {item.stock > 0 ? "BUY NOW" : "SOLD OUT"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}