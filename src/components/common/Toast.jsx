import { CheckCircle, XCircle, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Toast = () => {
    const { toast, showToast } = useCart();

    if (!toast) return null;

    return (
        <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{toast.message}</span>
            {/* Opción de cerrar manual */}
        </div>
    );
};

export default Toast;
