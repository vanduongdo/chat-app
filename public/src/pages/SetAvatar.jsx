import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Buffer } from "buffer";

import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../assets/loader.gif";
import { setAvatarRoute } from "../utils/APIRoutes";

const SetAvatar = () => {
    const apiAvatar = "https://api.multiavatar.com/121212";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const isMounted = useRef(true);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
            return;
        }
        const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar],
        });
        
        if (data.isSet) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(user));
            navigate("/");
        } else {
            toast.error("Error setting avatar. Please try again", toastOptions);
        }
    };


    useEffect(() => {
        isMounted.current = true;

        const getAvatars = async () => {
            if (isLoading) {
                const data = [];
                const controller = new AbortController();
                const { signal } = controller;
                try {
                    for (let i = 0; i < 4; i++) {
                        const response = await axios.get(`${apiAvatar}/${Math.round(Math.random() * 1000)}`, { signal });
                        const buffer = Buffer.from(response.data);
                        data.push(buffer.toString("base64"));
                    }
                    if (isMounted.current) {
                        setAvatars(data);
                        setIsLoading(false);
                    }
                } catch (error) {
                    if (isMounted.current) {
                        console.error(error);
                        setIsLoading(false);
                    }
                }
            }
        };

        getAvatars();

        return () => {
            isMounted.current = false;
        };
    }, [isLoading]);

    // console.log('abcd');

    return (
        <>
            <Container>
                {isLoading ? (
                    <div className="loader">
                        <img src={Loader} alt="loader" />
                    </div>
                ) : (
                    <>
                        <div className="title-container">
                            <h1>Pick an Avatar as your profile picture</h1>
                        </div>
                        <div className="avatars">
                            {avatars.map((avatar, index) => {
                                return (
                                    <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="submit-btn" onClick={() => setProfilePicture()}>
                            Set as Profile Picture
                        </div>
                    </>
                )}
            </Container>
            <ToastContainer />
        </>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;

    .loader {
        max-inline-size: 100%;
    }

    .title-container {
        h1 {
            color: white;
        }
    }
    .avatars {
        display: flex;
        gap: 2rem;

        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img {
                height: 6rem;
                transition: 0.5s ease-in-out;
            }
        }
        .selected {
            border: 0.4rem solid #4e0eff;
        }
    }
    .submit-btn {
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
`;

export default SetAvatar;
