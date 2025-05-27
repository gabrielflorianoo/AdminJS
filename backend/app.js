import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import logger from "morgan";
import cors from "cors";

dotenv.config();

import { adminRouter, adminJs } from "./admin.js";

// Importação de rotas
import authRouter from "./routes/auth.js";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import studentsRouter from "./routes/students.js";
import classesRouter from "./routes/classes.js";
import enrollmentsRouter from "./routes/enrollments.js";
import attendancesRouter from "./routes/attendances.js";
import gradesRouter from "./routes/grades.js";

import {
    isLogged,
    hasPrivileges,
    authenticateToken,
} from "./controllers/AuthController.js";

const app = express();

// Middlewares padrão
app.use(json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(urlencoded({ extended: false }));
app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:5173",
                "https://admin-js-tau.vercel.app",
                process.env.FRONTEND_URL,
            ];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// AdminJS
app.use(adminJs.options.rootPath, adminRouter);

// Rotas
app.use("/", indexRouter);
app.use("/auth", authRouter);

// Rotas protegidas com autenticação e autorização
app.use(
    "/users",
    isLogged,
    authenticateToken,
    hasPrivileges("ADMIN"),
    usersRouter
);
app.use(
    "/students",
    isLogged,
    authenticateToken,
    hasPrivileges("ADMIN", "COORDINATOR"),
    studentsRouter
);
app.use(
    "/classes",
    isLogged,
    authenticateToken,
    hasPrivileges("ADMIN", "COORDINATOR"),
    classesRouter
);
app.use(
    "/enrollments",
    isLogged,
    authenticateToken,
    hasPrivileges("ADMIN", "COORDINATOR"),
    enrollmentsRouter
);
app.use(
    "/attendances",
    isLogged,
    authenticateToken,
    hasPrivileges("ADMIN", "COORDINATOR", "VOLUNTEER"),
    attendancesRouter
);
app.use(
    "/grades",
    isLogged,
    authenticateToken,
    hasPrivileges("ADMIN", "COORDINATOR"),
    gradesRouter
);

// Inicialização
console.log("Server is running on port 3000");

export default app;
