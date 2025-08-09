import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApps } from '../api/chatApi';

function AppListPage() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await getApps();
        if (response && Array.isArray(response.data)) {
          setApps(response.data);
        } else {
          const errorMessage = response.message || 'Received data is not in the expected format';
          throw new Error(errorMessage);
        }
      } catch (err) {
        console.error("Error fetching apps:", err);
        setError(err.message);
      }
    };

    fetchApps();
  }, []);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <header className="App-header">
      <h1>请选择一个应用</h1>
      <div className="list-container">
        {apps.length > 0 ? (
          apps.map(app => (
            <div key={app.appCode} className="list-item">
              <Link to={`/apps/${app.appCode}/chat`} state={{ app }}>
                <h2>{app.appName}</h2>
                <p>模型: {app.modelName} ({app.modelType})</p>
              </Link>
            </div>
          ))
        ) : (
          <p>没有找到应用，请确保后端服务已启动并运行正常。</p>
        )}
      </div>
    </header>
  );
}

export default AppListPage;
