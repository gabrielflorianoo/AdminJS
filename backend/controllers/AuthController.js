import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "seuSegredoSuperSecreto";

// Registrar novo usuário
export async function register(req, res) {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já registrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        res.status(201).json({
            message: "Usuário registrado com sucesso.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao registrar usuário.", err: error.message });
    }
}

// Login
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha incorreta." });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "2h",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60 * 1000, // 2 horas
        });

        res.json({
            message: "Login bem-sucedido.",
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao fazer login.", err: error.message });
    }
}

// Middleware: verificar se o usuário está autenticado
export function isLogged(req, res, next) {
    return req.cookies.token
        ? next()
        : res.status(401).json({ error: "Usuário não autenticado." });
}

export function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido ou expirado.", err: error.message });
    }
}

// Middleware: verificar se o usuário tem privilégio (papel) necessário
export function hasPrivileges(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role.toUpperCase())) {
            return res
                .status(407)
                .json({ error: "Acesso negado. Privilégios insuficientes." });
        }
        next();
    };
}

export async function getCurrentUser(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    res.json({ user });
}

export function logout(req, res) {
    res.clearCookie("token");
    res.json({ message: "Logout bem-sucedido." });
}
