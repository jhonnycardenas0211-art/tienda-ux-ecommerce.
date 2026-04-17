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
    const [shippingDetails, setShippingDetails] = useState({
        name: user?.firstName + ' ' + (user?.lastName || '') || '',
        address: 'Av. Central #45-12, Bogotá',
        phone: '312 456 7890',
        instructions: ''
    });
    const [selectedMethod, setSelectedMethod] = useState('');

    const handleShippingChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const handlePayPalApprove = async (data, actions) => {
        setLoading(true);
        setSelectedMethod('PayPal');
        try {
            const details = await actions.order.capture();

            const newOrder = {
                id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                date: new Date().toISOString().split('T')[0],
                total: cartTotal + 60000,
                status: 'Entregado',
                method: 'PayPal',
                user: user.email,
                customerName: shippingDetails.name,
                phone: shippingDetails.phone,
                items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))
            };

            const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
            localStorage.setItem('admin_orders', JSON.stringify([newOrder, ...orders]));

            await fetch('/api/sales/capture-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderID: data.orderID,
                    userEmail: details.payer.email_address,
                    userName: shippingDetails.name,
                    cart,
                    total: (cartTotal + 60000).toLocaleString('es-CO')
                })
            }).catch(e => console.log("Backend offline"));

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
        setSelectedMethod('Contra Entrega');
        setTimeout(() => {
            const newOrder = {
                id: 'D' + Math.floor(1000 + Math.random() * 9000),
                date: new Date().toISOString().split('T')[0],
                total: cartTotal + 60000,
                status: 'Contra Entrega',
                method: 'Efectivo',
                user: user.email,
                customerName: shippingDetails.name,
                phone: shippingDetails.phone,
                items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))
            };

            const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
            localStorage.setItem('admin_orders', JSON.stringify([newOrder, ...orders]));

            setStep(3);
            clearCart();
            setLoading(false);
        }, 1500);
    };


    if (step === 3) {
        return (
            <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{
                        padding: '3rem',
                        textAlign: 'center',
                        borderRadius: '30px',
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}
                >
                    <div style={{ width: '80px', height: '80px', background: '#4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <CheckCircle2 size={50} color="black" />
                    </div>

                    <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>
                        ¡Listo, tu pedido #{Math.floor(1000 + Math.random() * 9000)} fue recibido!
                    </h1>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Lo estamos preparando.</p>
                    <p style={{ color: 'white', fontWeight: '600', marginBottom: '2rem' }}>
                        Tiempo estimado: <span style={{ color: 'var(--accent-secondary)' }}>15-25 min.</span>
                    </p>

                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        border: '1px solid var(--border-glass)',
                        textAlign: 'left',
                        marginBottom: '2.5rem'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.3rem' }}>TIPO DE PEDIDO</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '900' }}>Domicilio</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.3rem' }}>PRODUCTOS</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '900' }}>{cart.length || 2}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.3rem' }}>TOTAL</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '900' }}>${(cartTotal + 60000).toLocaleString('es-CO')}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.3rem' }}>MÉTODO DE PAGO</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '900' }}>{selectedMethod || 'Tarjeta'}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => navigate('/history')} className="premium-btn" style={{ padding: '1.2rem', borderRadius: '15px', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                            Ver estado del pedido
                        </button>
                        <Link to="/" className="btn-outline" style={{ padding: '1.2rem', borderRadius: '15px', color: 'white', textDecoration: 'none', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
                            Seguir viendo el menú
                        </Link>
                    </div>
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
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{step === 1 ? 'RESUMEN DE LA ORDEN' : 'PAGO'}</h2>
                    </div>

                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '30px' }}>
                        {step === 1 ? (
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label style={labelStyle}>NOMBRE *</label>
                                    <input type="text" name="name" value={shippingDetails.name} onChange={handleShippingChange} placeholder="Ej. Juan Pérez" style={inputStyle} required />
                                </div>
                                <div className="input-group">
                                    <label style={labelStyle}>DIRECCIÓN *</label>
                                    <input type="text" name="address" value={shippingDetails.address} onChange={handleShippingChange} placeholder="Ej. Calle 12 # 34 56" style={inputStyle} required />
                                </div>
                                <div className="input-group">
                                    <label style={labelStyle}>TELÉFONO *</label>
                                    <input type="text" name="phone" value={shippingDetails.phone} onChange={handleShippingChange} placeholder="Ej. 312 456 7890" style={inputStyle} required />
                                </div>
                                <div className="input-group">
                                    <label style={labelStyle}>INSTRUCCIONES DE ENTREGA (OPCIONAL)</label>
                                    <input type="text" name="instructions" value={shippingDetails.instructions} onChange={handleShippingChange} placeholder="Ej. Dejar en la portería" style={inputStyle} />
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="premium-btn" style={{ padding: '1.2rem', borderRadius: '15px', marginTop: '1rem', fontWeight: 'bold' }}>
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
