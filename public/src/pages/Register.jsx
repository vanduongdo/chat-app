import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/logo.svg";
import { registerRoute } from "../utils/APIRoutes";

const Register = () => {
const navigate = useNavigate();

    const [values, setValue] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { userName, email, password, confirmPassword } = values;

            const { data } = await axios.post(
                registerRoute,
                {
                    userName,
                    email,
                    password,
                    confirmPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if(data.status === false) {
                toast.error(data.msg, toastOptions);
                return;
            }
            localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(data.user));
            navigate("/");
        }
    };

    const handleValidation = () => {
        const { password, confirmPassword, userName, email } = values;

        if (password !== confirmPassword) {
            toast.error("password and confirm password should be same", toastOptions);
            return false;
        } else if (userName.length < 3) {
            toast.error("username should be greater than 3 characters", toastOptions);
            return false;
        } else if (password.length < 8) {
            toast.error("password should be equal or greater than 8 characters", toastOptions);
            return false;
        } else if (email === "") {
            toast.error("email is required", toastOptions);
            return false;
        }

        return true;
    };

    const handleChange = (event) => {
        setValue({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>Snappy</h1>
                    </div>
                    <input type="text" placeholder="User Name" name="userName" onChange={(e) => handleChange(e)} />
                    <input id="inputId" type="email" placeholder="Email" name="email" onChange={(e) => handleChange(e)} />
                    <input type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)} />
                    <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={(e) => handleChange(e)} />

                    <button type="submit">Register</button>
                    <span>
                        already have an account? <Link to="/login">Login</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
};

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 5rem;
        }
        h1 {
            color: white;
            text-transform: uppercase;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
    }
    input {
        background-color: transparent !important;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        border-radius: 0.4rem;
        color: white;
        width: 100%;
        font-size: 1rem;
        &:focus {
            border: 0.1rem solid #997af0;
            outline: none;
        }
    }
    button {
        background-color: #9b76ff;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.3s ease-in-out;
        &:hover {
            background-color: #4e0eff;
        }
    }
    span {
        color: white;
        text-transform: uppercase;
        a {
            color: #4e0eff;
            text-decoration: none;
            font-weight: bold;
        }
    }
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 50px #0a0a14 inset; /* Change the color to your own background color */
        -webkit-text-fill-color: #fff;
    }

    input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 50px #0a0a14 inset; /*your box-shadow*/
        -webkit-text-fill-color: #fff;
    }
`;

export default Register;
