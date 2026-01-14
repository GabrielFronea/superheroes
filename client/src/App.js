import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useParams, useNavigate, Navigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/supereroi';

// --- LOGIN COMPONENT ---
const Login = ({ setAuth }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (user === 'admin' && pass === '1234') {
      localStorage.setItem('isAuth', 'true');
      setAuth(true);
      navigate('/admin');
    } else { alert('Date incorecte!'); }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Login Admin</h2>
      <input placeholder="User" onChange={e => setUser(e.target.value)} /><br/>
      <input type="password" placeholder="Parola" onChange={e => setPass(e.target.value)} /><br/>
      <button onClick={handleLogin}>Intră</button>
    </div>
  );
};

// --- CATALOG COMPONENT ---
// --- CATALOG COMPONENT ACTUALIZAT ---
const Catalog = () => {
  const [eroi, setEroi] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [limita, setLimita] = useState(10);
  const [cautare, setCautare] = useState("");
  const [filtru, setFiltru] = useState("Toti");

  // Cerere Globală: Trimitem cautare, pagina și filtrul către Backend
  useEffect(() => {
    axios.get(`${API_URL}?page=${pagina}&limit=${limita}&publisher=${filtru}&search=${cautare}`)
      .then(res => setEroi(res.data))
      .catch(err => console.error("Eroare preluare catalog:", err));
  }, [pagina, limita, filtru, cautare]); // Re-executăm la orice schimbare a căutării

  // IMPORTANT: Nu mai folosim .filter() aici pentru că serverul face treaba

  return (
    <div style={{ padding: '20px' }}>
      <nav><Link to="/login" style={{textDecoration: 'none'}}>⚙️ Mergi la Admin</Link></nav>
      <h1>🦸 Catalog Supereroi</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* Căutare Globală: Schimbarea textului declanșează useEffect-ul de mai sus */}
        <input 
          placeholder="🔍 Caută în toată baza de date..." 
          value={cautare}
          onChange={e => { setCautare(e.target.value); setPagina(1); }} 
          style={{ padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        
        <select value={limita} onChange={e => {setLimita(e.target.value); setPagina(1);}} style={{padding: '10px'}}>
          <option value="5">5 pe pagină</option>
          <option value="10">10 pe pagină</option>
          <option value="20">20 pe pagină</option>
        </select>

        <select value={filtru} onChange={e => {setFiltru(e.target.value); setPagina(1);}} style={{padding: '10px'}}>
          <option value="Toti">Toate Universurile</option>
          <option value="Marvel Comics">Marvel</option>
          <option value="DC Comics">DC</option>
          <option value="George Lucas">Star Wars / Lucas</option>
          <option value="Dark Horse Comics">Dark Horse</option>
          <option value="NBC - Heroes">NBC Heroes</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '20px' }}>
        {eroi.length > 0 ? (
          eroi.map(e => (
            <div key={e.id} className="card" style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#fff' }}>
              <img src={e.image} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} alt={e.name} />
              <h3 style={{margin: '10px 0'}}>{e.name}</h3>
              <p style={{fontSize: '12px', color: '#666'}}>{e.biography?.publisher}</p>
              <Link to={`/detaliu/${e.id}`} style={{color: '#2196F3', fontWeight: 'bold', textDecoration: 'none'}}>Vezi Detalii</Link>
            </div>
          ))
        ) : (
          <p style={{gridColumn: '1/-1', textAlign: 'center', padding: '20px'}}>Nu s-au găsit eroi pentru "{cautare}".</p>
        )}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button disabled={pagina === 1} onClick={() => setPagina(p => Math.max(1, p - 1))} style={{padding: '8px 15px', cursor: 'pointer'}}>Anterior</button>
        <span style={{ margin: '0 20px' }}> Pagina <strong>{pagina}</strong> </span>
        <button onClick={() => setPagina(p => p + 1)} style={{padding: '8px 15px', cursor: 'pointer'}}>Următor</button>
      </div>
    </div>
  );
};

// --- DETALIU COMPONENT ---
const Detaliu = () => {
  const { id } = useParams();
  const [e, setE] = useState(null);
  useEffect(() => { axios.get(`${API_URL}/${id}`).then(res => setE(res.data)); }, [id]);

  if (!e) return <p>Incarcare...</p>;
  return (
    <div style={{ padding: '30px' }}>
      <Link to="/">⬅ Înapoi</Link>
      <h1>{e.name}</h1>
      <div style={{ display: 'flex', gap: '30px' }}>
        <img src={e.image} style={{ width: '350px', borderRadius: '15px' }} alt="" />
        <div>
          <h3>Informații complete:</h3>
          <p><strong>Nume complet:</strong> {e.biography?.['full-name']}</p>
          <p><strong>Univers:</strong> {e.biography?.publisher}</p>
          <p><strong>Locul nașterii:</strong> {e.biography?.['place-of-birth']}</p>
          <h4>Statistici:</h4>
          <ul>
            <li>Inteligență: {e.powerstats?.intelligence}</li>
            <li>Putere: {e.powerstats?.strength}</li>
            <li>Viteză: {e.powerstats?.speed}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN COMPONENT ---
const Admin = () => {
  const [eroi, setEroi] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [limita, setLimita] = useState(10);
  const [cautare, setCautare] = useState(""); // Aceasta va fi valoarea trimisă la server
  const [inputCautare, setInputCautare] = useState(""); // Aceasta este valoarea din input în timp ce scrii
  const [form, setForm] = useState({ name: '', image: '', biography: { publisher: '' } });
  const [editId, setEditId] = useState(null);

  const refresh = () => {
    axios.get(`${API_URL}?page=${pagina}&limit=${limita}&search=${cautare}`)
      .then(res => setEroi(res.data))
      .catch(err => console.error("Eroare preluare admin:", err));
  };

  // Se reîncarcă doar când se schimbă pagina, limita sau când confirmăm căutarea prin buton
  useEffect(() => {
    refresh();
  }, [pagina, cautare, limita]);

  const handleImage = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result });
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const handleSearchClick = () => {
    setCautare(inputCautare);
    setPagina(1); // Resetăm la prima pagină la fiecare căutare nouă
  };

  const save = () => {
    if (editId) {
      axios.put(`${API_URL}/${editId}`, form).then(() => {
        setEditId(null);
        setForm({ name: '', image: '', biography: { publisher: '' } });
        refresh();
      });
    } else {
      axios.post(API_URL, form).then(() => {
        setForm({ name: '', image: '', biography: { publisher: '' } });
        refresh();
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ marginBottom: '10px' }}>
        <Link to="/" style={{ fontSize: '14px', textDecoration: 'none', color: 'blue' }}>⬅ Înapoi la Catalog</Link>
      </nav>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>🛠 Panou Control</h1>

      {/* --- 1. ADAUGĂ EROU NOU (Acum este prima secțiune) --- */}
      <div style={{ background: '#f5f5f5', padding: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
        <h3 style={{ marginTop: 0 }}>{editId ? 'Editează Erou' : 'Adaugă Erou Nou'}</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            placeholder="Nume erou" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            style={{ padding: '8px', border: '1px solid #aaa' }}
          />
          <input type="file" onChange={handleImage} style={{ fontSize: '13px' }} />
          <button onClick={save} style={{ padding: '8px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            {editId ? 'Actualizează' : 'Salvează'}
          </button>
          {editId && (
            <button onClick={() => {setEditId(null); setForm({name:'', image:'', biography:{publisher:''}});}} style={{ padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
              Anulează
            </button>
          )}
        </div>
      </div>

      {/* --- 2. CAUTARE SI FILTRARE (A doua secțiune) --- */}
      <div style={{ background: '#ffffff', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label><strong>Caută:</strong></label>
          <input 
            placeholder="Caută erou în baza de date..." 
            value={inputCautare}
            onChange={(e) => setInputCautare(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
            style={{ padding: '8px', width: '250px', border: '1px solid #ccc' }}
          />
          {/* BUTONUL NOU: Caută! */}
          <button 
          onClick={handleSearchClick}
          style={{ background: '#2196F3', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
          Caută!
        </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label><strong>Afișează:</strong></label>
          <select value={limita} onChange={(e) => { setLimita(e.target.value); setPagina(1); }} style={{ padding: '8px' }}>
            <option value="10">10 pe pagină</option>
            <option value="20">20 pe pagină</option>
            <option value="50">50 pe pagină</option>
          </select>
        </div>
      </div>

      {/* --- 3. TABEL DATE --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', border: '1px solid #ccc' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{ padding: '12px', border: '1px solid #ccc', width: '80px' }}>ID</th>
            <th style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'left' }}>Nume</th>
            <th style={{ padding: '12px', border: '1px solid #ccc', width: '200px' }}>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {eroi.length > 0 ? (
            eroi.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ textAlign: 'center', padding: '10px', border: '1px solid #eee' }}>{e.id}</td>
                <td style={{ padding: '10px', border: '1px solid #eee' }}>{e.name}</td>
                <td style={{ padding: '10px', border: '1px solid #eee', textAlign: 'center' }}>
                  <button onClick={() => { setEditId(e.id); setForm(e); window.scrollTo(0,0); }} style={{ marginRight: '8px', padding: '5px 10px', cursor: 'pointer' }}>Editează</button>
                  <button onClick={() => { if(window.confirm(`Sigur ștergi eroul ${e.name}?`)) axios.delete(`${API_URL}/${e.id}`).then(refresh) }} style={{ color: 'red', padding: '5px 10px', cursor: 'pointer', border: '1px solid red', background: 'transparent', borderRadius: '4px' }}>Șterge</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#777' }}>Nu s-au găsit rezultate pentru "{cautare}".</td></tr>
          )}
        </tbody>
      </table>

      {/* --- 4. PAGINARE --- */}
      <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} style={{ padding: '6px 12px', cursor: pagina === 1 ? 'not-allowed' : 'pointer' }}>Anterior</button>
        <span> Pagina <strong>{pagina}</strong> </span>
        <button onClick={() => setPagina(pagina + 1)} style={{ padding: '6px 12px', cursor: 'pointer' }}>Următor</button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isAuth, setAuth] = useState(localStorage.getItem('isAuth') === 'true');

  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/detaliu/:id" element={<Detaliu />} />
      <Route path="/login" element={<Login setAuth={setAuth} />} />
      <Route path="/admin" element={isAuth ? <Admin /> : <Navigate to="/login" />} />
    </Routes>
  );
}