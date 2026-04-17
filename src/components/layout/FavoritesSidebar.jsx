import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const FavoritesSidebar = () => {
    const { favorites, toggleFavorite, isFavoritesOpen, setIsFavoritesOpen, addToCart } = useCart();

    return (
        <AnimatePresence>
            {isFavoritesOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFavoritesOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.8)',
                            zIndex: 1900,
                            backdropFilter: 'blur(4px)'
                        }}
                    />

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '100%',
                            maxWidth: '400px',
                            height: '100vh',
                            background: 'var(--bg-card)',
                            zIndex: 2000,
                            padding: '2rem',
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            borderLeft: '1px solid var(--border-color)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Tus Favoritos</h3>
                            <button
                                onClick={() => setIsFavoritesOpen(false)}
                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gap: '1.5rem', paddingRight: '0.5rem' }}>
                            {favorites.length === 0 ? (
                                <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                                    <p>No tienes favoritos todavía.</p>
                                </div>
                            ) : (
                                favorites.map(product => (
                                    <div key={product.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                        <div style={{ width: '80px', height: '80px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                                            <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <Link
                                                to={`/product/${product.id}`}
                                                onClick={() => setIsFavoritesOpen(false)}
                                                style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}
                                            >
                                                {product.name}
                                            </Link>
                                            <p style={{ color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.2rem' }}>
                                                ${product.price.toLocaleString('es-CO')}
                                            </p>
                                            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid var(--accent-red)',
                                                        color: 'var(--accent-red)',
                                                        fontSize: '0.7rem',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    <ShoppingCart size={12} /> AL CARRITO
                                                </button>
                                                <button
                                                    onClick={() => toggleFavorite(product)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {favorites.length > 0 && (
                            <button
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '2rem' }}
                                onClick={() => setIsFavoritesOpen(false)}
                            >
                                CONTINUAR COMPRANDO
                            </button>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default FavoritesSidebar;
