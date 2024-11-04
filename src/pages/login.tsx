import { useApi } from "@/app/api";
import { useState } from "react";
import { Button, Input } from "rsuite";

export default function LoginPage() {
    const api = useApi();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isFailed, setIsFailed] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const login = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), method: 'POST' });
            if (response.status == 400) {
                setIsFailed(true);
                setPassword('');
            } else {
                api.userStore.setUser(await response.json());
                await api.router.push('/welcome');
            }
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) return <div className="loader" />;

    return <div>
        {isFailed && <div className="mb" style={{ color: 'red' }}>
            We could not log you in. Please check your username/password and try again.
        </div>}
        <div className="mb">
            <label>Username</label>
            <Input type="text" onChange={setUsername} value={username} />
        </div>
        <div className="mb">
            <label>Password</label>
            <Input type="password" onChange={setPassword} value={password} />
        </div>

        <div className="mb">
            <Button onClick={login}>Login</Button>
        </div>
    </div>
}