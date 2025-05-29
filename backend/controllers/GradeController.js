import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar todas as notas
export async function getAllGrades(req, res) {
    try {
        const grades = await prisma.grade.findMany({
            include: {
                student: true,
                class: true
            }
        });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obter uma nota por ID
export async function getGradeById(req, res) {
    const { id } = req.params;
    try {
        const grade = await prisma.grade.findUnique({
            where: { id: Number(id) },
            include: {
                student: true,
                class: true
            }
        });
        if (!grade) return res.status(404).json({ error: 'Nota não encontrada.' });
        res.json(grade);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Criar nova nota
export async function createGrade(req, res) {
    const { studentId, classId, value, description, date } = req.body;
    try {
        const newGrade = await prisma.grade.create({
            data: {
                studentId: Number(studentId),
                classId: Number(classId),
                value: parseFloat(value),
                description,
                date: date ? new Date(date) : new Date()
            }
        });
        res.status(201).json(newGrade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Atualizar nota
export async function updateGrade(req, res) {
    const { id } = req.params;
    const { value, description, date } = req.body;
    try {
        const updatedGrade = await prisma.grade.update({
            where: { id: Number(id) },
            data: {
                value: parseFloat(value),
                description,
                date: new Date(date)
            }
        });
        res.json(updatedGrade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Deletar nota
export async function deleteGrade(req, res) {
    const { id } = req.params;
    try {
        await prisma.grade.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Nota deletada com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}