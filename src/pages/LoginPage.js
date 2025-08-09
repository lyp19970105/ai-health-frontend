import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await auth.login(username, password);
            // The navigation logic will be handled by a useEffect in App.js
            // in response to the isAuthenticated state change.
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>登录</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label>用户名</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>密码</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">登录</button>
                <p className="switch-auth">
                    还没有账户? <Link to="/register">立即注册</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
