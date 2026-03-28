import React, { useState } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Admin({ user }) {
  const [formData, setFormData] = useState({ name: '', price: '', category: 'gaming', image: '', description: '' });
  const [status, setStatus] = useState("");

  // 🛡️ SECURITY CHECK: Sirf aapka email handle karega
  // Apne asli Google email se replace karein
  const ADMIN_EMAIL = "karanhore18@gmail.com"; 

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
        <h1>🚫 ACCESS DENIED: ADMIN ONLY</h1>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");
    try {
      await addDoc(collection(db, "products"), formData);
      setStatus("✅ Product Added Successfully!");
      setFormData({ name: '', price: '', category: 'gaming', image: '', description: '' });
    } catch (err) {
      setStatus("❌ Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: '120px 10%', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '30px', color: '#a855f7' }}>ADMIN PANEL</h2>
      <form onSubmit={handleSubmit} className="glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Product Name (e.g. Netflix Premium)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={inputStyle} />
        <input type="text" placeholder="Price (e.g. 199)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required style={inputStyle} />
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={inputStyle}>
          <option value="gaming">Gaming</option>
          <option value="ott">OTT</option>
        </select>
        <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={inputStyle} />
        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '100px'}} />
        <button type="submit" style={{ padding: '15px', background: '#a855f7', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>UPLOAD ASSET</button>
        {status && <p style={{ textAlign: 'center', marginTop: '10px' }}>{status}</p>}
      </form>
    </div>
  );
}

const inputStyle = { padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px' };