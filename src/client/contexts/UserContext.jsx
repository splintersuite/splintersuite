import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

const initialState = {
    username: '',
    invoices: [],
};

export const UserContext = React.createContext({ ...initialState });

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => {
    const [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [invoices, setInvoices] = useState(initialState.invoices);

    useEffect(() => {
        const getUser = async () => {
            const res = await window.api.user.get();
            if (res.code === 1) {
                setUsername(res.data.user.username);
                setUser(res.data.user);
                setInvoices(res.data.user.invoices);
            }
        };
        getUser();
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

    const handleConfirmInvoice = async (invoice) => {
        invoice.due = moment(invoice.due).format();
        const res = await window.api.invoice.confirm({ invoice });
    };

    return (
        <UserContext.Provider
            value={{
                ...initialState,
                user,
                username,
                invoices,
                handleLogout,
                handleLogin,
                handleConfirmInvoice,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};
