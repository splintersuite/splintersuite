import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

const initialState = {
    username: '',
    invoices: [
        {
            name: 'Splinterlands Season 12',
            due: moment(),
            amount: 1234,
            paid: false,
        },
        {
            name: 'Splinterlands Season 13',
            due: moment(),
            amount: 1234,
            paid: true,
        },
        {
            name: 'Splinterlands Season 14',
            due: moment(),
            amount: 1234,
            paid: true,
        },
    ],
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

    const handleUpdateInvoice = async (invoice) => {
        invoice.due = moment(invoice.due).format();
        const res = await window.api.invoice.update({ invoice });
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
                handleUpdateInvoice,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};
