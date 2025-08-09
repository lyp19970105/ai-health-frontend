import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await auth.register(username, password, nickname);
            setSuccess('注册成功! 即将跳转到登录页面...');
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>注册</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="form-group">
                    <label>用户名</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>昵称</label>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>密码</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">注册</button>
                <p className="switch-auth">
                    已有账户? <Link to="/login">立即登录</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;
