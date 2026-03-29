import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });
  const [products, setProducts] = useState([]);

  const auth = getAuth();
  
  // 🛡️ Hya email la fkt access milnar
  const ADMIN_EMAIL = "tujha-email@gmail.com"; 

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      // Jar user login aahe ANI tyacha email ADMIN_EMAIL shi match hoto
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    const unsubData = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    return () => { unsubAuth(); unsubData(); };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Chori pakdi gayi! Credentials chukiche aahet.");
    }
  };

  // 1. Jar User Login nahiye, tar Login Form dakhva
  if (!user) {
    return (
      <div className="page-fade" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', color: 'white' }}>
        <form onSubmit={handleLogin} className="glass" style={{ padding: '40px', display: 'grid', gap: '15px', width: '350px' }}>
          <h2 style={{ textAlign: 'center', color: '#a855f7' }}>Admin Login</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" style={{ padding: '12px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  }

  // 2. Jar User Admin aahe, tar Main Admin Panel dakhva
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), { ...formData, stock: Number(formData.stock) });
    alert("Product Live! 🚀");
    setFormData({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });
  };

  const handleStockUpdate = async (id, newVal) => {
    await updateDoc(doc(db, "products", id), { stock: Number(newVal) });
  };

  return (
    <div className="page-fade" style={{ padding: '40px', maxWidth: '800px', margin: 'auto', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>VoidStore Admin Panel</h2>
        <button onClick={() => signOut(auth)} style={{ padding: '8px 15px', background: '#ef4444', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer' }}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '20px', background: '#111', padding: '20px', borderRadius: '15px' }}>
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        <input placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
        <input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={inputStyle} />
        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px'}} />
        <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
        <button type="submit" style={{ padding: '12px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>ADD PRODUCT</button>
      </form>

      {/* Inventory Management List yahan pe pehle jaisi rahegi */}
    </div>
  );
}

const inputStyle = { padding: '12px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '8px' };