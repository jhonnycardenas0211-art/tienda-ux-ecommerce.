import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
    // Read from localStorage (includes orders from Checkout)
    const storedOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]');

    // We can also have an initial mock for the first load if it's empty
    const history = storedOrders.length > 0 ? storedOrders : [
        {
            id: 'ORD-INIT-01',
            date: '2026-04-10',
            total: 1200000,
            status: 'Entregado',
            items: [
                { name: 'Ejemplo: Premium Watch', qty: 1, price: 1200000 }
            ]
        }
    ];

    return (
        <div className="container" style={{ padding: '4rem 0', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Package color="var(--accent-red)" size={40} /> Historial de Compras
            </h1>

            {history.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '4rem', borderRadius: '30px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Aún no has realizado ninguna compra.</p>
                    <Link to="/" className="btn-outline" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>IR A LA TIENDA</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {history.map((order, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={order.id}
                            className="glass"
                            style={{ padding: '2rem', borderRadius: '20px', borderLeft: '4px solid var(--accent-red)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Pedido #{order.id}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                                        <Calendar size={14} /> {order.date}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <CheckCircle2 size={14} /> {order.status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span>{item.qty}x {item.name}</span>
                                        <span>${item.price.toLocaleString('es-CO')}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <DollarSign size={18} color="var(--accent-red)" /> {order.total.toLocaleString('es-CO')}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
