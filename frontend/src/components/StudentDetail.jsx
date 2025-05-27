import React from "react";
import EnrollmentDetails from "./EnrollmentDetails";
import AttendanceDetails from "./AttendanceDetails";
import GradesDetails from "./GradesDetails";
import ConfirmModal from "./ConfirmModal";

import { useNavigate } from "react-router-dom";
import api from "../server/Api";

export default function StudentDetailModal({ student, isActive, onClose }) {
    if (!student) return null;
    const navigate = useNavigate();

    const [isEnrollmentDetailsVisible, setEnrollmentDetailsVisible] =
        React.useState(false);
    const [isAttendanceDetailsVisible, setAttendanceDetailsVisible] =
        React.useState(false);
    const [isGradesDetailsVisible, setGradesDetailsVisible] =
        React.useState(false);
    const [isConfirmModalVisible, setConfirmModalVisible] =
        React.useState(false);

    function calculateAge(date) {
        const birth = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    const closeConfirmModal = () => {
        setConfirmModalVisible(false);
    };
    const confirmAction = async () => {
        await api.delete(`/students/${student.id}`, {
            withCredentials: true,
        });

        closeConfirmModal();
        onClose();
        
        window.location.reload();   // Recarregar a página para refletir a exclusão
    };

    const processedData = {
        nome: student.name,
        email: student.email,
        "Nota Geral": student.grade,
        "Data de nascimento": new Date(student.birthDate).toLocaleDateString(),
        idade: calculateAge(student.birthDate),
    };

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, "$1 $2");
    };

    return (
        <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Detalhes do Aluno</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                </header>
                <section className="modal-card-body info-student">
                    <section>
                        {Object.entries(processedData).map(([key, value]) => (
                            <p key={key}>
                                <strong>{formatLabel(key)}:</strong> {value}
                            </p>
                        ))}
                    </section>
                    <section>
                        <button
                            className="button is-link"
                            onClick={() =>
                                setAttendanceDetailsVisible(
                                    !isAttendanceDetailsVisible
                                )
                            }
                        >
                            Histórico de Presença
                        </button>
                        <button
                            className="button is-link"
                            onClick={() =>
                                setGradesDetailsVisible(!isGradesDetailsVisible)
                            }
                        >
                            Histórico de Notas
                        </button>
                        <button
                            className="button is-link"
                            onClick={() =>
                                setEnrollmentDetailsVisible(
                                    !isEnrollmentDetailsVisible
                                )
                            }
                        >
                            Matriculas
                        </button>
                    </section>
                </section>
                <footer className="modal-card-foot is-flex is-justify-content-space-between">
                    <button className="button is-link" onClick={onClose}>
                        Fechar
                    </button>
                    <button
                        className="button is-link"
                        onClick={() => navigate(`/edit/students/${student.id}`)}
                    >
                        ✏️ Editar
                    </button>
                    <button
                        className="button is-danger"
                        onClick={() => setConfirmModalVisible(true)}
                    >
                        🗑️ Excluir Aluno
                    </button>
                </footer>
            </div>

            {isEnrollmentDetailsVisible && (
                <EnrollmentDetails
                    studentId={student.id}
                    isActive={isEnrollmentDetailsVisible}
                    onClose={() => setEnrollmentDetailsVisible(false)}
                />
            )}
            {isAttendanceDetailsVisible && (
                <AttendanceDetails
                    studentId={student.id}
                    isActive={isAttendanceDetailsVisible}
                    onClose={() => setAttendanceDetailsVisible(false)}
                />
            )}
            {isGradesDetailsVisible && (
                <GradesDetails
                    studentId={student.id}
                    isActive={isGradesDetailsVisible}
                    onClose={() => setGradesDetailsVisible(false)}
                />
            )}
            <ConfirmModal
                isActive={isConfirmModalVisible}
                onClose={closeConfirmModal}
                onConfirm={confirmAction}
                title="Excluir Aluno"
                message={`Você tem certeza que deseja excluir o(a) aluno(a) ${student.name}?`}
            />
        </div>
    );
}
