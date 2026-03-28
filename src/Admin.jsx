import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function Admin() {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), { ...formData, stock: Number(formData.stock) });
    alert("Product added successfully!");
    setFormData({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });
  };

  // 📝 Purane products ka stock update karne ke liye
  const handleStockUpdate = async (id, newVal) => {
    await updateDoc(doc(db, "products", id), { stock: Number(newVal) });
  };

  return (
    <div className="page-fade" style={{ padding: '40px', color: 'white', maxWidth: '800px', margin: 'auto' }}>
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '20px', background: '#111', padding: '20px', borderRadius: '15px' }}>
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        <input placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
        <input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={inputStyle} />
        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px'}} />
        <input type="number" placeholder="Initial Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle}>
          <option value="ott">OTT</option><option value="gaming">Gaming</option><option value="ai">AI</option>
        </select>
        <button type="submit" style={{ padding: '12px', background: '#a855f7', color: 'white', border: 'none', cursor: 'pointer' }}>ADD PRODUCT</button>
      </form>

      <h3 style={{ marginTop: '40px' }}>Current Inventory (Edit Stock Below)</h3>
      <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
        {products.map(p => (
          <div key={p.id} className="glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{p.name}</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px' }}>Qty:</span>
              <input type="number" defaultValue={p.stock} onBlur={(e) => handleStockUpdate(p.id, e.target.value)} style={{ width: '60px', background: '#222', color: 'white', border: '1px solid #444', padding: '5px' }} />
              <button onClick={() => deleteDoc(doc(db, "products", p.id))} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const inputStyle = { padding: '10px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '8px' };