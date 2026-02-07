/* src/components/RouteSearch.jsx */
import React, { useState } from 'react';

const RouteSearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                <input
                    type="text"
                    placeholder="노선 번호 입력 (예: 급행1, 401)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '14px 20px',
                        borderRadius: '16px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        outline: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        transition: 'all 0.3s ease'
                    }}
                />
                <button
                    type="submit"
                    className="cta-button"
                    style={{
                        padding: '0 24px',
                        whiteSpace: 'nowrap',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    조회
                </button>
            </div>
        </form>
    );
};

export default RouteSearch;
