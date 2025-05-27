import React from "react";

export default function StudentFilter({ filters, setFilters, closeFilters }) {
    return (
        <section className="box mb-4">
            <section className="columns is-flex is-justify-content-space-between p-2">
                <h2 className="title is-5">Filtros</h2>
                <button className="button is-danger mb-4" onClick={closeFilters}>
                    Fechar Filtros
                </button>
            </section>
            <div className="columns is-multiline">
                <div className="column is-4">
                    <div className="field">
                        <label className="label">Nome</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="Buscar por nome"
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
                        <label className="label">Email</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="Buscar por email"
                                value={filters.email}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="column is-4">
                    <div className="field">
                        <label className="label">Idade mínima</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                placeholder="Ex: 12"
                                value={filters.minAge}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        minAge: e.target.value,
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
