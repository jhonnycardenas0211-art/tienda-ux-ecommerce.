import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { cartCount, favCount, setIsFavoritesOpen } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <nav style={{
            backgroundColor: 'var(--bg-navbar)',
            height: '80px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Logo */}
                <NavLink to="/" className="logo-text">
                    [STORE <span className="logo-highlight">UX</span>]
                </NavLink>

                {/* Search Bar - Hidden on small screens for brevity here, but could be made responsive */}
                <NavLink to="/search" className="nav-search">
                    <div style={{
                        width: '100%',
                        padding: '0.6rem 1rem 0.6rem 2.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        Buscar productos...
                    </div>
                    <Search
                        size={18}
                        color="var(--text-muted)"
                        style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                </NavLink>

                {/* Actions */}
                <div className="nav-actions">
                    <button
                        onClick={() => setIsFavoritesOpen(true)}
                        aria-label="Ver favoritos"
                        style={{ color: 'white', position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                        <Heart size={24} fill={favCount > 0 ? 'var(--accent-red)' : 'none'} color={favCount > 0 ? 'var(--accent-red)' : 'white'} />
                        {favCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'white',
                                color: 'black',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontWeight: 'bold'
                            }}>{favCount}</span>
                        )}
                    </button>
                    <NavLink to="/cart" aria-label="Ver carrito" style={{ color: 'white', position: 'relative', display: 'flex' }}>
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'var(--accent-red)',
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontWeight: 'bold'
                            }}>{cartCount}</span>
                        )}
                    </NavLink>

                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }} className="nav-user-info">
                                <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-secondary)', margin: 0 }}>PREMIUM</p>
                                <NavLink to="/history" style={{ fontSize: '0.8rem', fontWeight: '600', margin: 0, color: 'white', textDecoration: 'none' }}>{user.firstName || user.username} (Historial)</NavLink>
                            </div>
                            <button
                                onClick={logout}
                                aria-label="Cerrar Sesión"
                                style={{ color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '0.5rem', cursor: 'pointer' }}
                                title="Cerrar Sesión"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            aria-label="Iniciar Sesión"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'white',
                                textDecoration: 'none',
                                background: 'var(--grad-premium)',
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                fontWeight: '800'
                            }}
                        >
                            <User size={18} /> INICIAR SESIÓN
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
