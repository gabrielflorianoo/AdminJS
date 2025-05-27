import React from "react";
import ClassTable from "../components/ClassTable";

export default function Classes() {
    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Turmas</h1>
                <p className="subtitle">
                    Visualize e gerencie as turmas cadastradas.
                </p>

                <ClassTable />
            </div>
        </section>
    );
}
