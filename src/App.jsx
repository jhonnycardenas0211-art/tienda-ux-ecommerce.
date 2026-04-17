import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import History from './pages/History';
import Search from './pages/Search';
import Navbar from './components/layout/Navbar';
import FavoritesSidebar from './components/layout/FavoritesSidebar';
import Toast from './components/common/Toast';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <FavoritesSidebar />
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <footer className="container" style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>&copy; 2026 <span className="notranslate" translate="no">STORE UX</span>. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
