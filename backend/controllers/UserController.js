import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// List all users
export async function getAllUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get user by ID
export async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create new user
export async function createUser(req, res) {
    const { name, email, password, role } = req.body;
    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, hashedPassword, role }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Update user
export async function updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, hashedPassword, role }
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete user
export async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: Number(id) } });
        res.json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}