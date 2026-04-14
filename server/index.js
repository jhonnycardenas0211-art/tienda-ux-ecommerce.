import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import salesRoutes from './routes/salesRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sales', salesRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
