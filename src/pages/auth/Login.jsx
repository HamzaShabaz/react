import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser.jsx';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);
        navigate('/');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}