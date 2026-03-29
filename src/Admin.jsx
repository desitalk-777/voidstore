import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });
  const [products, setProducts] = useState([]);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  // 🛡️ YAHAN APNA EMAIL DALO (Jo Google se login karoge)
  const ADMIN_EMAIL = "karanhore18@gmail.com"; 

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
      } else {
        if (currentUser) { alert("Access Denied!"); signOut(auth); }
        setUser(null);
      }
    });

    const unsubData = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    return () => { unsubAuth(); unsubData(); };
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, provider); } catch (err) { alert("Login Fail!"); }
  };

  // --- 1. LOGIN SCREEN (Agar login nahi ho) ---
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '150px', color: 'white' }}>
        <h2 style={{ marginBottom: '20px', color: '#a855f7' }}>VoidStore Admin Login</h2>
        <button onClick={handleLogin} style={{ padding: '12px 25px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Login with Google
        </button>
      </div>
    );
  }

  // --- 2. TERA ASLI ADMIN FORM (Jo maine uda diya tha) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), { ...formData, stock: Number(formData.stock) });
    alert("Product added successfully! 🚀");
    setFormData({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });
  };

  const handleStockUpdate = async (id, newVal) => {
    await updateDoc(doc(db, "products", id), { stock: Number(newVal) });
  };

  return (
    <div className="page-fade" style={{ padding: '40px', color: 'white', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#a855f7' }}>Admin Panel</h2>
        <button onClick={() => signOut(auth)} style={{ padding: '5px 15px', background: '#ef4444', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer' }}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '20px', background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
        <input placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} required />
        <input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={inputStyle} required />
        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px'}} required />
        <input type="number" placeholder="Initial Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle}>
          <option value="ott">OTT</option><option value="gaming">Gaming</option><option value="ai">AI</option>
        </select>
        <button type="submit" style={{ padding: '12px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>ADD PRODUCT</button>
      </form>

      <h3 style={{ marginTop: '40px' }}>Current Inventory (Edit Stock Below)</h3>
      <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
        {products.map(p => (
          <div key={p.id} className="glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{p.name}</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px' }}>Qty:</span>
              <input type="number" defaultValue={p.stock} onBlur={(e) => handleStockUpdate(p.id, e.target.value)} style={{ width: '60px', background: '#222', color: 'white', border: '1px solid #444', padding: '5px' }} />
              <button onClick={() => { if(window.confirm("Delete karun?")) deleteDoc(doc(db, "products", p.id)) }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '8px' };