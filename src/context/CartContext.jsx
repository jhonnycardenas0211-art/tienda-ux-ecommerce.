import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('ux-store-cart');
        return localData ? JSON.parse(localData) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const localData = localStorage.getItem('ux-store-favorites');
        return localData ? JSON.parse(localData) : [];
    });

    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        localStorage.setItem('ux-store-cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('ux-store-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const toggleFavorite = (product) => {
        setFavorites((prev) => {
            const isFav = prev.find(item => item.id === product.id);
            if (isFav) {
                showToast(`Removido de favoritos`, 'success');
                return prev.filter(item => item.id !== product.id);
            }
            showToast(`Añadido a favoritos`, 'success');
            return [...prev, product];
        });
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        showToast(`Éxito: ${product.name} añadido`, 'success');
    };

    const removeFromCart = (productId) => {
        setCart((prev) => {
            const item = prev.find(i => i.id === productId);
            if (item && item.quantity > 1) {
                return prev.map(i => i.id === productId ? { ...i, quantity: i.quantity - 1 } : i);
            }
            return prev.filter(i => i.id !== productId);
        });
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const favCount = favorites.length;

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount,
            favorites, toggleFavorite, favCount, isFavoritesOpen, setIsFavoritesOpen,
            toast, showToast
        }}>
            {children}
        </CartContext.Provider>
    );
};
