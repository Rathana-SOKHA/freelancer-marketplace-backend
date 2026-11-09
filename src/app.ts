import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import freelancerProfileRoutes from './routes/freelancerProfileRoutes.js';
import freelancerDirectoryRoutes from './routes/freelancerDirectoryRoutes.js';
import clientProfileRoutes from './routes/clientProfileRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Frelancer Backend is running..."
    });
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/freelancer-profile", freelancerProfileRoutes);
app.use("/api/freelancers", freelancerDirectoryRoutes);
app.use("/api/client-profile", clientProfileRoutes);
app.use("/api/jobs", jobRoutes);

export default app;
