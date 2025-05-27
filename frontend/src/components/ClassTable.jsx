import React from "react";
import ClassFilter from "./ClassFilter";
import api from "../server/Api";

export default function ClassTable() {
    const [classes, setClasses] = React.useState([]);
    const [filters, setFilters] = React.useState({
        name: "",
        description: "",
        responsibleName: "",
        startDate: "",
        endDate: "",
    });
    const [isFilterVisible, setIsFiltersVisible] = React.useState(false);

    React.useEffect(() => {
        async function fetchClasses() {
            try {
                const response = await api.get("/classes");
                setClasses(response.data);
            } catch (error) {
                console.error("Erro ao buscar turmas:", error);
            }
        }

        fetchClasses();
    });

    const filteredClasses = classes.filter((turma) => {
        const nameMatch = turma.name
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        const responsibleNameMatch = turma.responsible.name
            .toLowerCase()
            .includes(filters.responsibleName.toLowerCase());
        const startDateMatch =
            filters.startDate === "" ||
            new Date(turma.startDate) >= new Date(filters.startDate);
        const endDateMatch =
            filters.endDate === "" ||
            (turma.endDate &&
                new Date(turma.endDate) <= new Date(filters.endDate));

        return (
            nameMatch &&
            responsibleNameMatch &&
            startDateMatch &&
            endDateMatch
        );
    });

    return (
        <>
            {isFilterVisible ? (
                <ClassFilter
                    filters={filters}
                    setFilters={setFilters}
                    closeFilters={() => setIsFiltersVisible(!isFilterVisible)}
                />
            ) : (
                <button
                    className="button is-primary mb-4"
                    onClick={() => setIsFiltersVisible(!isFilterVisible)}
                >
                    Mostrar Filtros
                </button>
            )}
            <table className="table is-fullwidth is-hoverable is-striped mt-5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Responsável</th>
                        <th>Início</th>
                        <th>Fim</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClasses.map((turma) => (
                        <tr key={turma.id} className="is-clickable">
                            <td>{turma.id}</td>
                            <td>{turma.name}</td>
                            <td>{turma.responsible.name}</td>
                            <td>
                                {new Date(turma.startDate).toLocaleDateString()}
                            </td>
                            <td>
                                {turma.endDate
                                    ? new Date(
                                          turma.endDate
                                      ).toLocaleDateString()
                                    : "Em andamento"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
