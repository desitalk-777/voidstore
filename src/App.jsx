import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
// 🔥 Yahan dhyaan do: 'db' aur 'provider' export hona zaroori hai firebase.js se
import { db, auth, provider } from './firebase'; 
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Products from './Products';
import Admin from './Admin';
import './App.css';

function Gamepad() {
  const { scene } = useGLTF('/models/gamepad.glb');
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      // 🪄 Smooth movement logic
      const targetRotationY = (state.mouse.x * Math.PI) / 10;
      const targetRotationX = (-state.mouse.y * Math.PI) / 15;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.1);
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.4} position={[0, -0.1, 0]} />
    </group>
  );
}

export default function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(null);

  // 🛡️ Ye listener check karta rahega ki aap logged in ho ya nahi
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Current User:", currentUser?.email);
    });
    return () => unsub();
  }, []);

  // 🔗 Login Link Function
  const handleAuthAction = async () => {
    if (user) {
      await signOut(auth);
      setView('home');
    } else {
      try {
        // Isse hi Google popup khulega
        await signInWithPopup(auth, provider);
      } catch (err) {
        alert("Login failed! Check if Google Auth is enabled in Firebase.");
      }
    }
  };

  return (
    <div className="page-fade" style={{ width: '100%', minHeight: '100vh', background: '#000', color: '#fff', overflowX: 'hidden' }}>
      
      {/* 🔝 Navbar with Working Links */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', boxSizing: 'border-box' }}>
        <h2 onClick={() => setView('home')} style={{ cursor: 'pointer', fontWeight: 900, margin: 0 }}>
          VOID<span style={{ color: '#a855f7' }}>STORE</span>
        </h2>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>HOME</span>
          <span className={`nav-link ${view === 'products' ? 'active' : ''}`} onClick={() => setView('products')}>PRODUCTS</span>
          
          {/* Admin tab only visible to logged in users */}
          {user && <span className={`nav-link ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>ADMIN</span>}

          {/* 🔘 LINKED LOGIN BUTTON */}
          <button onClick={handleAuthAction} className="login-btn">
            {user ? 'LOGOUT' : 'LOGIN'}
          </button>
        </div>
      </nav>

      <main>
        {view === 'home' ? (
          <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Responsive Hero Text */}
            <div style={{ zIndex: 10, textAlign: 'center', pointerEvents: 'none', padding: '0 20px' }}>
              <h1 style={{ fontSize: '15vw', fontWeight: 900, margin: 0, lineHeight: 0.8 }}>VOID</h1>
              <h1 style={{ fontSize: '15vw', fontWeight: 900, margin: 0, background: 'linear-gradient(90deg, #a855f7, #00ffff)', WebkitBackgroundClip: 'text', color: 'transparent', lineHeight: 0.8 }}>GAMING</h1>
              <p style={{ color: '#888', marginTop: '10px', letterSpacing: '2px', fontSize: '10px' }}>SECURE ASSETS • INSTANT ACCESS</p>
            </div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
                <Suspense fallback={null}>
                  <Float speed={1.5} rotationIntensity={0.2}><Gamepad /></Float>
                  <Environment preset="city" />
                  <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} />
                </Suspense>
              </Canvas>
            </div>
          </section>
        ) : view === 'products' ? (
          <div style={{ paddingTop: '100px' }}><Products /></div>
        ) : (
          <div style={{ paddingTop: '100px' }}><Admin user={user} /></div>
        )}
      </main>
    </div>
  );
}