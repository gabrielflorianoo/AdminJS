import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar todas as matrículas
export async function getAllEnrollments(req, res) {
    try {
        const enrollments = await prisma.enrollment.findMany({
            include: {
                student: true,
                class: true
            }
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar matrículas.' });
    }
}

// Obter uma matrícula por ID
export async function getEnrollmentById(req, res) {
    const { id } = req.params;
    try {
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: Number(id) },
            include: {
                student: true,
                class: true
            }
        });
        if (!enrollment) return res.status(404).json({ error: 'Matrícula não encontrada.' });
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar matrícula.' });
    }
}

// Criar nova matrícula
export async function createEnrollment(req, res) {
    const { studentId, classId } = req.body;
    try {
        const newEnrollment = await prisma.enrollment.create({
            data: {
                studentId: Number(studentId),
                classId: Number(classId)
            }
        });
        res.status(201).json(newEnrollment);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar matrícula. Verifique se o aluno já está matriculado nesta turma.' });
    }
}

// Atualizar matrícula (caso queira permitir alterar turma ou aluno)
export async function updateEnrollment(req, res) {
    const { id } = req.params;
    const { studentId, classId } = req.body;
    try {
        const updatedEnrollment = await prisma.enrollment.update({
            where: { id: Number(id) },
            data: {
                studentId: Number(studentId),
                classId: Number(classId)
            }
        });
        res.json(updatedEnrollment);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar matrícula.' });
    }
}

// Deletar matrícula
export async function deleteEnrollment(req, res) {
    const { id } = req.params;
    try {
        await prisma.enrollment.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Matrícula deletada com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao deletar matrícula.' });
    }
}