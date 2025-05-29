import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EditPage from "./pages/EditPage";
import CreatePage from "./pages/CreatePage";

import { PrivateRoute, PublicRoute } from "./utils/RouteGuards"; // supondo que criou os arquivos aqui

function App() {
    return (
        <Router basename="/AdminJS">
            <AuthProvider>
                <Header />

                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/classes"
                        element={
                            <PrivateRoute>
                                <Classes />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/students"
                        element={
                            <PrivateRoute>
                                <Students />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/edit/:type/:id"
                        element={
                            <PrivateRoute>
                                <EditPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/create/:type"
                        element={
                            <PrivateRoute>
                                <CreatePage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    <Route path="*" element={<Home />} />
                </Routes>

                <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;
