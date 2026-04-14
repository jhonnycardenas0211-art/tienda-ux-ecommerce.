import jwt from 'jsonwebtoken';

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const loginAdmin = (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: "Invalid credentials" });
};

export const getDashboard = (req, res) => {
    const salesData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
            label: 'Ventas 2024',
            data: [1200, 1900, 3000, 5000, 2400, 3200]
        }]
    };

    // Mock products data directly from DummyJSON mapping or mock
    const productsData = [
        { id: 1, name: "Premium Watch", category: "Accessories", price: 299, stock: 45 },
        { id: 2, name: "Wireless Headphones", category: "Electronics", price: 159, stock: 12 },
        { id: 3, name: "Leather Bag", category: "Fashion", price: 199, stock: 8 },
        { id: 4, name: "Smart Glasses", category: "Electronics", price: 399, stock: 24 }
    ];

    res.json({ success: true, data: { salesData, productsData } });
};
