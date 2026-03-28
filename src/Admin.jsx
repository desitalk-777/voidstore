import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function Admin() {
  const [formData, setFormData] = useState({ name: '', price: '', desc: '', img: '', cat: 'ott', stock: '10' });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert("Details bharo bhai!");
    try {
      await addDoc(collection(db, "products"), {
        ...formData,
        stock: Number(formData.stock) // Manual Stock Control
      });
      alert("Product Live ho gaya! 🚀");
      setFormData({ name: '', price: '', desc: '', img: '', cat: 'ott', stock: '10' });
    } catch (err) { alert(err.message); }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Uda doon?")) await deleteDoc(doc(db, "products", id));
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', color: 'white' }}>
      <h2>VoidStore Admin Panel</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        <input placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
        <input placeholder="Description" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} style={inputStyle} />
        <input placeholder="Image URL" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} style={inputStyle} />
        <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
        <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} style={inputStyle}>
          <option value="ott">OTT</option>
          <option value="gaming">Gaming</option>
          <option value="ai">AI</option>
        </select>
        <button type="submit" style={{ padding: '15px', background: '#a855f7', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>ADD PRODUCT</button>
      </form>

      <div style={{ marginTop: '40px' }}>
        {products.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #222' }}>
            <span>{p.name} (Stock: {p.stock})</span>
            <button onClick={() => deleteItem(p.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '8px' };