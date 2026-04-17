import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PayPalButtons } from '@paypal/react-paypal-js';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Necesitas iniciar sesión</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Para finalizar tu compra premium, por favor accede a tu cuenta.</p>
                <Link to="/login" className="premium-btn" style={{ padding: '1rem 2rem', textDecoration: 'none' }}>INICIAR SESIÓN</Link>
            </div>
        );
    }

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Tu carrito está vacío</h2>
                <Link to="/" className="btn-outline" style={{ padding: '1rem 2rem', textDecoration: 'none' }}>VOLVER A LA TIENDA</Link>
            </div>
        );
    }

    const handlePayPalApprove = async (data, actions) => {
        setLoading(true);
        try {
            const details = await actions.order.capture();

            const newOrder = {
                id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                date: new Date().toISOString().split('T')[0],
                total: cartTotal + 60000,
                status: 'Entregado',
                user: user.email,
                items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))
            };

            // Save for Admin and History
            const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
            localStorage.setItem('admin_orders', JSON.stringify([newOrder, ...orders]));

            // Call backend API (optional if backend isn't ready, but keep for structure)
            await fetch('/api/sales/capture-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderID: data.orderID,
                    userEmail: details.payer.email_address,
                    userName: user?.firstName || 'Usuario',
                    cart,
                    total: (cartTotal + 60000).toLocaleString('es-CO')
                })
            }).catch(e => console.log("Backend offline, order saved locally for demo"));

            setStep(3);
            clearCart();
        } catch (error) {
            console.error(error);
            alert("Hubo un error con PayPal.");
        } finally {
            setLoading(false);
        }
    };


    const handleCashOnDelivery = () => {
        setLoading(true);
        setTimeout(() => {
            const newOrder = {
                id: 'VOU-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                date: new Date().toISOString().split('T')[0],
                total: cartTotal + 60000,
                status: 'Contra Entrega', // Special status
                method: 'Efectivo',
                user: user.email,
                items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))
            };

            // Save for Admin and History
            const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
            localStorage.setItem('admin_orders', JSON.stringify([newOrder, ...orders]));

            setStep(3);
            clearCart();
            setLoading(false);
        }, 1500);
    };


    if (step === 3) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass"
                    style={{ padding: '4rem', textAlign: 'center', borderRadius: '40px', maxWidth: '600px' }}
                >
                    <div style={{ width: '100px', height: '100px', background: 'var(--grad-premium)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                        <CheckCircle2 size={60} color="white" />
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }}>¡PEDIDO RECIBIDO!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                        Gracias por tu compra, {user.firstName}.
                        <br />
                        <span style={{ color: 'white', fontWeight: 'bold' }}>Tu Voucher de pago ha sido generado.</span>
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '15px', border: '1px dashed var(--border-glass)', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>NÚMERO DE VOUCHER</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '2px' }}>VOU-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                    </div>
                    <Link to="/" className="premium-btn" style={{ padding: '1rem 3rem', textDecoration: 'none', borderRadius: '15px' }}>VOLVER AL INICIO</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="checkout-layout">
                {/* Form Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            {step === 1 ? <Truck color="var(--accent-secondary)" /> : <CreditCard color="var(--accent-secondary)" />}
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{step === 1 ? 'ENVÍO' : 'PAGO'}</h2>
                    </div>

                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '30px' }}>
                        {step === 1 ? (
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label style={labelStyle}>DIRECCIÓN DE ENTREGA</label>
                                    <input type="text" placeholder="Calle Falsa 123" style={inputStyle} defaultValue="Av. Central #45-12, Bogotá" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label style={labelStyle}>CIUDAD</label>
                                        <input type="text" style={inputStyle} defaultValue="Medellín" />
                                    </div>
                                    <div className="input-group">
                                        <label style={labelStyle}>CÓDIGO POSTAL</label>
                                        <input type="text" style={inputStyle} defaultValue="05001" />
                                    </div>
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="premium-btn" style={{ padding: '1.2rem', borderRadius: '15px', marginTop: '1rem' }}>
                                    CONTINUAR AL PAGO
                                </button>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <p style={{ color: 'white', textAlign: 'center', marginBottom: '1rem' }}>Selecciona tu método de pago seguro</p>
                                <div style={{ zIndex: 0, position: 'relative', minHeight: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '1rem', border: '1px solid var(--border-glass)' }}>
                                    <PayPalButtons
                                        style={{ layout: "vertical", shape: "rect", color: "gold" }}
                                        forceReRender={[cartTotal]}
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                intent: "CAPTURE",
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            currency_code: "USD",
                                                            value: (cartTotal + 60000).toFixed(2), // PayPal requires dot notation, but keep in mind PayPal may not accept large values easily in tests without COP setup
                                                        },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={handlePayPalApprove}
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    onClick={handleCashOnDelivery}
                                    disabled={loading}
                                    className="btn-outline"
                                    style={{
                                        padding: '1.2rem',
                                        borderRadius: '15px',
                                        borderColor: 'var(--accent-secondary)',
                                        color: 'var(--accent-secondary)',
                                        fontWeight: '800',
                                        background: 'rgba(100, 255, 218, 0.05)'
                                    }}
                                >
                                    {loading ? 'PROCESANDO...' : 'PAGAR CONTRA ENTREGA'}
                                </button>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, padding: '1.2rem', borderRadius: '15px' }}>
                                        ATRÁS
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <ShieldCheck size={16} /> Pago 100% seguro y encriptado.
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>RESUMEN</h2>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', background: 'white', borderRadius: '8px', padding: '4px' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: '600', margin: 0 }}>{item.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>x{item.quantity}</p>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '800' }}>${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Subtotal</span>
                                <span>${cartTotal.toLocaleString('es-CO')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Envío Premium</span>
                                <span>$60.000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '900', marginTop: '1rem' }}>
                                <span>TOTAL</span>
                                <span className="gradient-text">${(cartTotal + 60000).toLocaleString('es-CO')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
};

const inputStyle = {
    width: '100%',
    padding: '1.2rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-glass)',
    borderRadius: '15px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none'
};

export default Checkout;
