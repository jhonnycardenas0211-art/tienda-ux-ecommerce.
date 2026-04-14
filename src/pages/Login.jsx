import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(credentials.username, credentials.password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '3rem',
                    borderRadius: '40px',
                    position: 'relative'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--grad-premium)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <LogIn size={30} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-2px', marginBottom: '0.5rem' }}>BIENVENIDO</h1>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Ingresa a tu cuenta premium</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="input-group">
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>USUARIO</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={iconStyle} />
                            <input
                                type="text"
                                name="username"
                                placeholder="kminchelle" // Usuario de ejemplo de DummyJSON
                                required
                                value={credentials.username}
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
                                placeholder="0lel09" // Password de ejemplo
                                required
                                value={credentials.password}
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
                        {loading ? 'INGRESANDO...' : (
                            <>INICIAR SESIÓN <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        ¿No tienes cuenta? <Link to="/register" style={{ color: 'white', fontWeight: '700', textDecoration: 'none' }}>Regístrate</Link>
                    </p>
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

export default Login;
