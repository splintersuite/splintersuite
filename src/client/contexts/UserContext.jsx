import React, { useContext, useEffect, useState } from 'react';

const initialState = {
    username: '',
};

export const UserContext = React.createContext({ ...initialState });

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const getUsername = async () => {
            const res = await window.api.user.get();
            if (res.code === 1) {
                setUsername(res.data.username);
            }
        };
        getUsername();
    }, []);

    const handleLogout = async () => {
        const res = await window.api.user.logout();
        setUsername('');
        return res;
    };

    const handleLogin = async ({ username, key }) => {
        const res = await window.api.user.login({ username, key });
        if (res.code === 1) {
            setUsername(username);
        }
        return res;
    };

    return (
        <UserContext.Provider
            value={{
                ...initialState,
                username,
                handleLogout,
                handleLogin,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};
