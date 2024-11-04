'use client';

import 'rsuite/dist/rsuite-no-reset.min.css';
import '@/app/app.css'
import type { AppProps } from 'next/app';
import { Nav } from 'rsuite';
import { useEffect, useState } from 'react';
import { useApi } from '@/app/api';

export default function App({ Component, pageProps }: AppProps) {
    const api = useApi();
    const [clientLoaded, setClientLoaded] = useState(false);

    useEffect(() => {
        setClientLoaded(true)
    }, [])

    const logout = async () => {
        await api.post('/api/auth/logout', {})
        api.userStore.clearUser();
        api.router.push('/login');
    }

    return clientLoaded && <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ top: '10px', width: '750px', display: 'inline-block' }}>
            <Nav>
                <Nav.Item href='/welcome' style={{ textDecoration: 'none' }}>Welcome</Nav.Item>
                <Nav.Item href="/users" style={{ textDecoration: 'none' }}>Users</Nav.Item>
                <Nav.Item style={{ color: 'red', textDecoration: 'none' }} onClick={logout}>Logout</Nav.Item>
            </Nav>
            <div style={{ margin: '10px 20px' }}>
                <Component {...pageProps} />
            </div>
        </div >
    </div>
}