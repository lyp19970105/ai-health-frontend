import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Header() {
    const auth = useAuth();

    return (
        <header className="main-header">
            <Link to="/" className="logo">Health Monitoring</Link>
            <nav>
                {auth.isAuthenticated && (
                    <div className="user-info">
                        <span>你好, {auth.user?.nickname || auth.user?.username}</span>
                        <button onClick={auth.logout} className="logout-button">登出</button>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;
