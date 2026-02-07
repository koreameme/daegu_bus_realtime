import React, { useState, useEffect } from 'react';

const RouteSearch = ({ onSearch, showReset, onReset }) => {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]);

    // Load history on mount
    useEffect(() => {
        const saved = localStorage.getItem('recent_bus_routes');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    const saveToHistory = (routeNo) => {
        const newHistory = [routeNo, ...history.filter(item => item !== routeNo)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('recent_bus_routes', JSON.stringify(newHistory));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            const trimmedQuery = query.trim();
            saveToHistory(trimmedQuery);
            onSearch(trimmedQuery);
        }
    };

    const handleHistoryClick = (routeNo) => {
        setQuery(routeNo);
        saveToHistory(routeNo);
        onSearch(routeNo);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('recent_bus_routes');
    };

    const handleReset = () => {
        setQuery('');
        if (onReset) onReset();
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-row">
                    <input
                        type="text"
                        placeholder="노선 번호 입력 (예: 급행1, 401)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                        style={{
                            padding: '14px 20px',
                            borderRadius: '16px',
                            border: '1px solid rgba(0,0,0,0.1)',
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            fontWeight: '600',
                            outline: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                    <button
                        type="submit"
                        className="cta-button"
                    >
                        조회
                    </button>
                    {showReset && (
                        <button
                            type="button"
                            className="reset-button"
                            onClick={handleReset}
                        >
                            초기화
                        </button>
                    )}
                </div>
            </form>

            {history.length > 0 && (
                <div className="recent-searches" style={{ width: '100%', maxWidth: '500px' }}>
                    <div className="recent-header">
                        <span>최근 검색</span>
                        <button onClick={clearHistory} className="clear-history">지우기</button>
                    </div>
                    <div className="recent-tags">
                        {history.map((route, index) => (
                            <button
                                key={index}
                                onClick={() => handleHistoryClick(route)}
                                className="recent-tag"
                            >
                                {route}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteSearch;
