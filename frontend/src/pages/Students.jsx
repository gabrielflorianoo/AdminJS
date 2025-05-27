import React from "react";
import StudentDetailModal from "../components/StudentDetail";
import StudentFilter from "../components/StudentFilter";
import api from "../server/Api";

export default function Students() {
    const [students, setStudents] = React.useState([]);
    const [selectedStudent, setSelectedStudent] = React.useState(null);
    const [isModalActive, setIsModalActive] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [filters, setFilters] = React.useState({
        name: "",
        email: "",
        minAge: "",
    });
    const [isFilterVisible, setIsFiltersVisible] = React.useState(false);

    React.useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await api.get("/students");
                setStudents(response.data);
            } catch (error) {
                if (error.status == 401) {
                    setError(
                        "Você precisa estar logado para acessar a lista de alunos."
                    );
                } else if (error.status == 403) {
                    setError(
                        "Você não tem permissão para acessar a lista de alunos."
                    );
                }
                console.error("Erro ao buscar alunos:", error);
            }
        }

        fetchStudents();
    }, []);

    const filteredStudents = students.filter((student) => {
        const nameMatch = student.name
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        const emailMatch = student.email
            .toLowerCase()
            .includes(filters.email.toLowerCase());
        const minAgeMatch =
            filters.minAge === "" ||
            new Date().getFullYear() -
                new Date(student.birthDate).getFullYear() >=
                parseInt(filters.minAge);

        return nameMatch && emailMatch && minAgeMatch;
    });

    const openStudentDetails = (studentId) => {
        const student = students.find((s) => s.id === studentId);
        setSelectedStudent(student);
        setIsModalActive(true);
    };

    const closeStudentDetails = () => {
        setSelectedStudent(null);
        setIsModalActive(false);
    };

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Alunos</h1>
                <p className="subtitle">
                    Gerencie os alunos inscritos no sistema.
                </p>

                {isFilterVisible ? (
                    <StudentFilter
                        filters={filters}
                        setFilters={setFilters}
                        closeFilters={() =>
                            setIsFiltersVisible(!isFilterVisible)
                        }
                    />
                ) : (
                    <button
                        className="button is-primary mb-4"
                        onClick={() => setIsFiltersVisible(!isFilterVisible)}
                    >
                        Mostrar Filtros
                    </button>
                )}

                {error ? (
                    <div className="notification is-danger has-text-centered">
                        {error}
                    </div>
                ) : (
                    <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Nota</th>
                                <th>Data de Nascimento</th>
                            </tr>
                        </thead>
                        <tbody className="students-list">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="is-clickable"
                                        onClick={() =>
                                            openStudentDetails(student.id)
                                        }
                                    >
                                        <th>{student.id}</th>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.grade || "Sem nota"}</td>
                                        <td>
                                            {new Date(
                                                student.birthDate
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="has-text-centered"
                                    >
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <StudentDetailModal
                isActive={isModalActive}
                student={selectedStudent}
                onClose={closeStudentDetails}
            />
        </section>
    );
}
