import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Frelancer Backend is running..."
    });
});

// Auth routes
app.use("/api/auth", authRoutes);

export default app;
