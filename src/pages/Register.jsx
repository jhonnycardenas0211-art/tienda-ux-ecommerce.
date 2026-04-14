import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await register(formData);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass"
                    style={{ padding: '4rem', textAlign: 'center', borderRadius: '30px', maxWidth: '500px' }}
                >
                    <CheckCircle2 size={80} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>¡BIENVENIDO!</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tu cuenta ha sido creada con éxito. Redirigiendo...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '3rem',
                    borderRadius: '40px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative background gradients */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'var(--grad-premium)', filter: 'blur(80px)', opacity: 0.3, zIndex: 0 }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-2px', marginBottom: '0.5rem' }}>
                            UNIRSE A <span className="gradient-text">UX</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Crea tu cuenta premium hoy mismo</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>NOMBRE</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>APELLIDO</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>USUARIO</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={iconStyle} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="johndoe123"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, paddingLeft: '3rem' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>EMAIL</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={iconStyle} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, paddingLeft: '3rem' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>CONTRASEÑA</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={iconStyle} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, paddingLeft: '3rem' }}
                                />
                            </div>
                        </div>

                        {error && (
                            <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="premium-btn"
                            style={{
                                padding: '1.2rem',
                                borderRadius: '15px',
                                fontSize: '1rem',
                                marginTop: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            {loading ? 'CREANDO CUENTA...' : (
                                <>CREAR CUENTA <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'white', fontWeight: '700', textDecoration: 'none' }}>Inicia Sesión</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '1.2rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-glass)',
    borderRadius: '15px',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s'
};

const iconStyle = {
    position: 'absolute',
    left: '1.2rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)'
};

export default Register;
