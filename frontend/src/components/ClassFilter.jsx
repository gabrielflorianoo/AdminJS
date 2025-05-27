import React from "react";

export default function ClassFilter({ filters, setFilters, closeFilters }) {
    return (
        <section className="box mb-4">
            <section className="columns is-flex is-justify-content-space-between p-2">
                <h2 className="title is-5">Filtros</h2>
                <button
                    className="button is-danger mb-4"
                    onClick={closeFilters}
                >
                    Fechar Filtros
                </button>
            </section>
            <div className="columns is-multiline">
                <div className="column is-4">
                    <div className="field">
                        <label className="label">Nome da Turma</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="Ex: Robótica"
                                value={filters.name}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="column is-4">
                    <div className="field">
                        <label className="label">Coordenador</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="Ex: João"
                                value={filters.coordinatorName}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        coordinatorName: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="column is-4">
                    <div className="field">
                        <label className="label">Descrição</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="Descrição da turma"
                                value={filters.description || ""}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="column is-4">
                    <div className="field">
                        <label className="label">Data de Início</label>
                        <div className="control">
                            <input
                                className="input"
                                type="date"
                                value={filters.startDate}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        startDate: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="column is-4">
                    <div className="field">
                        <label className="label">Data de Fim</label>
                        <div className="control">
                            <input
                                className="input"
                                type="date"
                                value={filters.endDate}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        endDate: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
