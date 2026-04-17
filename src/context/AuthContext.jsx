import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar usuario desde localStorage al iniciar
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const trackUserForAdmin = (userData) => {
        try {
            const allUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
            const userExists = allUsers.find(u => u.username === userData.username);

            if (!userExists) {
                const newUser = {
                    id: userData.id || Date.now(),
                    username: userData.username,
                    email: userData.email,
                    registeredAt: new Date().toISOString()
                };
                localStorage.setItem('admin_users', JSON.stringify([...allUsers, newUser]));
            }
        } catch (e) { console.error(e); }
    };

    const login = async (username, password) => {
        // Intercept Master Admin Account
        const ADMIN_USER = "jhnnynz2010@gmail.com";
        const ADMIN_PASS = "admin123";

        if (username.trim().toLowerCase() === ADMIN_USER && password.trim() === ADMIN_PASS) {
            const adminData = {
                id: 999,
                username: "jhnnynz2010@gmail.com",
                email: "jhnnynz2010@gmail.com",
                firstName: "Admin",
                lastName: "Project",
                gender: "other",
                image: "https://robohash.org/admin.png",
                role: "admin", // Mark as admin
                token: "mock-admin-token-" + Date.now()
            };
            setUser(adminData);
            localStorage.setItem('user', JSON.stringify(adminData));
            trackUserForAdmin(adminData);
            return { success: true, isAdmin: true };
        }

        try {
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                trackUserForAdmin(data);
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Error al iniciar sesión' };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: 'Error de conexión' };
        }
    };

    const register = async (userData) => {
        try {
            // Simulamos registro usando /users/add de DummyJSON
            const response = await fetch('https://dummyjson.com/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                // Autologueamos al usuario tras el registro
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                trackUserForAdmin(data);
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Error al crear cuenta' };
            }
        } catch (error) {
            console.error("Register error:", error);
            return { success: false, message: 'Error de conexión' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
