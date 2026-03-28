import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function Admin() {
  const [formData, setFormData] = useState({ name: '', price: '', desc: '', img: '', cat: 'ott', stock: 10 });
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
    alert("New Product Live!");
  };

  // ✅ Purane Products ka Stock Update karne ke liye function
  const handleUpdateStock = async (id, newStock) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { stock: Number(newStock) });
    alert("Stock Updated!");
  };

  return (
    <div className="page-fade" style={{ padding: '40px', maxWidth: '800px', margin: 'auto', color: 'white' }}>
      <h2>Admin Control</h2>
      
      {/* Add Form (Same as before) */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
         <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
         <input placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
         <input placeholder="Stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
         <button type="submit" style={{ padding: '12px', background: '#a855f7', border: 'none', color: 'white', cursor: 'pointer' }}>ADD PRODUCT</button>
      </form>

      {/* ✅ Inventory List with Live Stock Edit */}
      <h3 style={{ marginTop: '40px' }}>Manage Existing Products</h3>
      <div style={{ display: 'grid', gap: '15px', marginTop: '10px' }}>
        {products.map(p => (
          <div key={p.id} className="glass" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', alignItems: 'center' }}>
            <span>{p.name}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="number" 
                defaultValue={p.stock} 
                onBlur={(e) => handleUpdateStock(p.id, e.target.value)} 
                style={{ width: '60px', padding: '5px', background: '#222', color: '#fff', border: '1px solid #444' }}
              />
              <button onClick={() => deleteDoc(doc(db, "products", p.id))} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const inputStyle = { padding: '12px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '8px' };