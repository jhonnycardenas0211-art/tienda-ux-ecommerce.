import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, addToCart, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '3rem' }}>TU <span className="gradient-text">CARRITO</span></h1>

            <div className="checkout-layout">
                {/* Items List */}
                <div className="glass" style={{ padding: '3rem', borderRadius: '40px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <ShoppingBag size={80} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>Aún no has añadido productos premium.</p>
                            <button className="premium-btn" onClick={() => navigate('/')} style={{ padding: '1rem 3rem', borderRadius: '15px' }}>IR A LA TIENDA</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div style={{ width: '120px', height: '120px', background: 'white', borderRadius: '20px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div style={{ flex: 1, width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, wordBreak: 'break-word' }}>{item.name}</h3>
                                            <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5 }}>
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                                                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
                                                <span style={{ fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                                            </div>
                                            <p style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0 }}>${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div style={{ height: 'fit-content', position: 'sticky', top: '120px' }}>
                    <div className="glass" style={{ padding: '3rem', borderRadius: '40px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem' }}>NOTAS DE PAGO</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                <span style={{ fontWeight: '700' }}>${cartTotal.toLocaleString('es-CO')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Envío Premium</span>
                                <span style={{ color: 'var(--accent-secondary)', fontWeight: '700' }}>$60.000</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <span style={{ fontWeight: '800' }}>TOTAL</span>
                                <span className="gradient-text" style={{ fontSize: '2rem', fontWeight: '900' }}>${(cartTotal + 60000).toLocaleString('es-CO')}</span>
                            </div>
                        </div>

                        <button
                            className="premium-btn"
                            style={{ width: '100%', padding: '1.5rem', borderRadius: '20px', fontSize: '1.1rem' }}
                            onClick={() => navigate('/checkout')}
                            disabled={cart.length === 0}
                        >
                            PROCEDER AL PAGO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
