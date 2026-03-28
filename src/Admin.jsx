import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function Admin() {
  const [formData, setFormData] = useState({ name: '', price: '', desc: '', img: '', cat: 'ott', stock: 10 });
  const [products, setProducts] = useState([]);

  // Real-time listener for current inventory
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert("Basics toh dalo bhai!");
    
    try {
      await addDoc(collection(db, "products"), {
        name: formData.name,
        price: formData.price,
        description: formData.desc,
        image: formData.img,
        category: formData.cat,
        stock: Number(formData.stock),
        isAvailable: Number(formData.stock) > 0
      });
      alert("Product Added Successfully! 🚀");
      setFormData({ name: '', price: '', desc: '', img: '', cat: 'ott', stock: 10 });
    } catch (err) { alert("Error: " + err.message); }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Sure? Delete kar doon?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto', color: 'white' }}>
      <h2 style={{ color: '#a855f7', marginBottom: '20px' }}>VoidStore Admin</h2>
      
      {/* Add Product Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
        <input placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        <input placeholder="Price (₹)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
        <input placeholder="Description (Details for WhatsApp)" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} style={inputStyle} />
        <input placeholder="Image URL (Direct Link)" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} style={inputStyle} />
        <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
        <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} style={inputStyle}>
          <option value="ott">OTT</option>
          <option value="gaming">Gaming</option>
          <option value="ai">AI Tools</option>
        </select>
        <button type="submit" style={{ padding: '15px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>ADD TO STORE</button>
      </form>

      {/* Inventory List */}
      <h3 style={{ marginTop: '40px' }}>Live Inventory ({products.length})</h3>
      <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
        {products.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222' }}>
            <div>
              <strong style={{ color: '#fff' }}>{p.name}</strong> 
              <span style={{ color: '#888', marginLeft: '10px', fontSize: '12px' }}>Stock: {p.stock}</span>
            </div>
            <button onClick={() => deleteItem(p.id)} style={{ color: '#ef4444', background: 'none', border: '1px solid #ef4444', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white' };