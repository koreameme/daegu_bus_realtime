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
        <form onSubmit={handleSubmit} className="search-form" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="노선 번호 입력 (예: 급행1, 401)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '14px 20px',
                        borderRadius: '18px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        background: 'rgba(255,255,255,0.8)',
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
                    style={{ padding: '12px 28px', whiteSpace: 'nowrap', borderRadius: '18px' }}
                >
                    조회
                </button>
            </div>
        </form>
    );
};

export default RouteSearch;
