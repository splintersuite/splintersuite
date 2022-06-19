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

    const getUser = async () => {
        const res = await window.api.user.get();
        if (res.code === 1) {
            setUsername(res.data.user.username);
            setUser(res.data.user);
            setInvoices(res.data.user.invoices);
        }
        console.log(res);
    };

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

        if (res.data.isPaid) {
            const updatedInvoices = invoices.map((item) => {
                if (invoice.id === item.id) {
                    item.paid_at = true;
                }
                return item;
            });
            setInvoices(updatedInvoices);
        }
    };

    useEffect(() => {
        getUser();
    }, [username]);

    return (
        <UserContext.Provider
            value={{
                ...initialState,
                user,
                username,
                invoices,
                getUser,
                handleLogout,
                handleLogin,
                handleConfirmInvoice,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};
