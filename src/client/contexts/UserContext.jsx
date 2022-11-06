import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import hooks from '../hooks';

const initialState = {
    username: '',
    invoices: [],
};

const ONE_HOUR = 3600000;

export const UserContext = React.createContext({ ...initialState });

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => {
    const [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [invoices, setInvoices] = useState(initialState.invoices);
    const [userLoading, setUserLoading] = useState(true);

    const getUser = async () => {
        const res = await window.api.user.get();
        if (res?.code === 1) {
            setUsername(res.data.user.username);
            setUser(res.data.user);
            setInvoices(res.data.user.invoices);
        }
    };

    const handleLogout = async () => {
        const res = await window.api.user.logout();
        setUsername('');
        return res;
    };

    const handleLogin = async ({ username, key }) => {
        const res = await window.api.user.login({ username, key });
        if (res?.code === 1) {
            setUsername(username);
            await getUser();
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
            await getUser();
        }
    };

    useEffect(() => {
        getUser().then(() => {
            setUserLoading(false);
        });
    }, []);

    hooks.useInterval(async () => {
        await getUser();
    }, ONE_HOUR);

    return (
        <UserContext.Provider
            value={{
                ...initialState,
                user,
                username,
                invoices,
                userLoading,
                handleLogout,
                handleLogin,
                handleConfirmInvoice,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};
