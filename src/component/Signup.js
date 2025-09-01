import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState([]); // array of backend errors

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); // clear old errors

        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const json = await response.json();

        if (response.ok && json.authtoken) {
            localStorage.setItem("token", json.authtoken);
            window.location.href = "/";
        } else {
            // backend sends { errors: [...] }
            if (json.errors) {
                // convert array of errors into object {title: "...", description: "..."}
                const newErrors = {};
                json.errors.forEach(err => {
                    newErrors[err.path] = err.msg;
                });
                setErrors(newErrors);
            } else {
                setErrors([{ msg: json.error || "Something went wrong" }]);
            }
        }
    };

    return (
    <div className="justify-content-center main-content">
            <div className="card shadow-lg bg-dark text-light">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">🔑 Register</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-bold">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control input-dark"
                                id="name"
                                value={credentials.name}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, name: e.target.value })
                                }
                                required
                            />
                            {errors.name && <div className="text-danger mt-1">{errors.name}</div>}

                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control input-dark"
                                id="email"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, email: e.target.value })
                                }
                                required
                            />
                            {errors.email && <div className="text-danger mt-1">{errors.email}</div>}

                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control input-dark"
                                id="password"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, password: e.target.value })
                                }
                                required
                            />
                            {errors.password && <div className="text-danger mt-1">{errors.password}</div>}

                        </div>

                        {/* Show backend errors
                        {errors.length > 0 && (
                            <div className="text-danger mb-3">
                                <ul className="mb-0">
                                    {errors.map((err, index) => (
                                        <li key={index}>
                                            {err.path ? `${err.path}: ` : ""}{err.msg}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )} */}

                        <div className="d-grid">
                            <button type="submit" className="btn">
                                <i
                                    className="bi bi-box-arrow-in-right"
                                    style={{ color: "#3c8dde" }}
                                ></i>
                            </button>
                        </div>
                    </form>
                    <div className="container text-center" style={{ position: "inherit" }}>
                        <p>
                            Already have an account?{" "}
                            <Link
                                className="nav-link d-inline p-0 text-decoration-underline"
                                to="/login"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
