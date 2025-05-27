import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllAttendances(req, res) {
    try {
        const attendances = await prisma.attendance.findMany({
            include: {
                student: true,
                class: true
            }
        });
        res.json(attendances);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar presenças.' });
    }
}

export async function getAttendanceById(req, res) {
    const { id } = req.params;
    try {
        const attendance = await prisma.attendance.findUnique({
            where: { id: Number(id) },
            include: {
                student: true,
                class: true
            }
        });
        if (!attendance) return res.status(404).json({ error: 'Presença não encontrada.' });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar presença.' });
    }
}

export async function createAttendance(req, res) {
    const { studentId, classId, date, present } = req.body;
    try {
        const newAttendance = await prisma.attendance.create({
            data: {
                studentId: Number(studentId),
                classId: Number(classId),
                date: new Date(date),
                present: present ?? false
            }
        });
        res.status(201).json(newAttendance);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao registrar presença. Verifique se já existe presença para esse aluno, turma e data.' });
    }
}

export async function updateAttendance(req, res) {
    const { id } = req.params;
    const { date, present } = req.body;
    try {
        const updatedAttendance = await prisma.attendance.update({
            where: { id: Number(id) },
            data: {
                date: new Date(date),
                present
            }
        });
        res.json(updatedAttendance);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar presença.' });
    }
}

export async function deleteAttendance(req, res) {
    const { id } = req.params;
    try {
        await prisma.attendance.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Presença deletada com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao deletar presença.' });
    }
}