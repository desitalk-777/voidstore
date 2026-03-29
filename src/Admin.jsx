import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '', category: 'ott', stock: 10 });

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  // 🛡️ APNA EMAIL YAHAN DALO
  const ADMIN_EMAIL = "karanhore18@gmail.com"; 

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
      } else {
        if (currentUser) {
          alert("Access Denied! Sirf Madhav hi admin hai.");
          signOut(auth);
        }
        setUser(null);
      }
    });

    const unsubData = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    return () => { unsubAuth(); unsubData(); };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert("Login failed!");
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '150px', color: 'white' }}>
        <h2 style={{ marginBottom: '20px' }}>VoidStore Admin Control</h2>
        <button 
          onClick={handleGoogleLogin} 
          style={{ padding: '15px 30px', background: 'white', color: 'black', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="google" />
          Login with Google
        </button>
      </div>
    );
  }

  // --- Baki ka Form aur Inventory code wahi purana rahega ---
  return (
    <div className="page-fade" style={{ padding: '40px', maxWidth: '800px', margin: 'auto', color: 'white' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Welcome, Admin</h3>
          <button onClick={() => signOut(auth)} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
       </div>
       {/* Tera Add Product Form aur Inventory List yahan chipka dena */}
    </div>
  );
}