import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <nav
            className="navbar is-primary"
            role="navigation"
            aria-label="main navigation"
        >
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <strong>Projeto ELLP</strong>
                </a>

                <a
                    role="button"
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarBasic"
                    onClick={() => {
                        const burger = document.querySelector(".navbar-burger");
                        const menu = document.getElementById("navbarBasic");
                        burger.classList.toggle("is-active");
                        menu.classList.toggle("is-active");
                    }}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasic" className="navbar-menu">
                <div className="navbar-start">
                    <a href="/classes" className="navbar-item">
                        Turmas
                    </a>

                    <a href="/students" className="navbar-item">
                        Alunos
                    </a>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            {user ? (
                                <>
                                    <span className="navbar-item">
                                        Olá, {user.name}
                                    </span>
                                    <button
                                        className="button is-light"
                                        onClick={logout}
                                    >
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a
                                        href="/login"
                                        className="button is-light"
                                    >
                                        Login
                                    </a>
                                    <a
                                        href="/register"
                                        className="button is-primary"
                                    >
                                        Registrar
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
