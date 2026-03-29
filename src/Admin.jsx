import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });
  const [products, setProducts] = useState([]);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  // 🛡️ APNA EMAIL YAHAN DALO
  const ADMIN_EMAIL = "karanhore18@gmail.com"; 

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email === ADMIN_EMAIL) {
          setUser(currentUser);
        } else {
          setUser("DENIED"); // Special state for unauthorized users
        }
      } else {
        setUser(null);
      }
      setIsAuthChecking(false);
    });

    const unsubData = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    return () => { unsubAuth(); unsubData(); };
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, provider); } catch (err) { console.log("Login Cancelled"); }
  };

  if (isAuthChecking) return <div style={{color: 'white', textAlign: 'center', marginTop: '100px'}}>Loading Security...</div>;

  // 1. ❌ ACCESS DENIED SCREEN (Agar koi aur login kare)
  if (user === "DENIED") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '150px', color: '#ff4444' }}>
        <h1 style={{ fontSize: '3rem' }}>🚫 ACCESS DENIED</h1>
        <p style={{ color: '#888', marginBottom: '20px' }}>You do not have permission to manage VoidStore.</p>
        <button onClick={() => signOut(auth)} style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Try Another Account</button>
      </div>
    );
  }

  // 2. 🔑 LOGIN SCREEN (Starting state)
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '150px', color: 'white' }}>
        <h2 style={{ marginBottom: '20px', color: '#a855f7' }}>VoidStore Security</h2>
        <button onClick={handleLogin} style={{ padding: '12px 25px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Verify Identity with Google
        </button>
      </div>
    );
  }

  // 3. ✅ TERA PURANA ASLI FORM (Sab wapas aa gaya!)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), { ...formData, price: Number(formData.price), stock: Number(formData.stock) });
    alert("Product Live! 🚀");
    setFormData({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });
  };

  const handleStockUpdate = async (id, newVal) => {
    await updateDoc(doc(db, "products", id), { stock: Number(newVal) });
  };

  return (
    <div className="page-fade" style={{ padding: '40px', color: 'white', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#a855f7' }}>VoidStore Control Center</h2>
        <button onClick={() => signOut(auth)} style={{ padding: '5px 15px', background: '#ef4444', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer' }}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '20px', background: '#111', padding: '25px', borderRadius: '15px', border: '1px solid #333' }}>
        <input placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
        <input type="number" placeholder="Price (₹)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} required />
        <input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={inputStyle} required />
        <textarea placeholder="Product Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px'}} required />
        <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={inputStyle} required />
        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle}>
          <option value="ott">OTT</option><option value="gaming">Gaming</option><option value="ai">AI Tools</option>
        </select>
        <button type="submit" style={{ padding: '12px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>ADD PRODUCT</button>
      </form>

      <h3 style={{ marginTop: '40px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Inventory</h3>
      <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
        {products.map(p => (
          <div key={p.id} className="glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{p.name}</span>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input type="number" defaultValue={p.stock} onBlur={(e) => handleStockUpdate(p.id, e.target.value)} style={{ width: '50px', background: '#000', color: '#0f0', border: '1px solid #444', padding: '5px' }} />
              <button onClick={() => { if(window.confirm("Delete?")) deleteDoc(doc(db, "products", p.id)) }} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '8px' };