import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

function Header() {
    const auth = useAuth();
    const { pageTitle } = useAppContext();

    return (
        <header className="main-header">
            <Link to="/" className="logo">Health Monitoring</Link>
            <div className="header-title">{pageTitle}</div>
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
