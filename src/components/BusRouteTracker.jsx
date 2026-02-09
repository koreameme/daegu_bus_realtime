
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import RouteSearch from './RouteSearch.jsx';
import { getRouteId, getRouteLocations, getRouteStations } from '../services/api_service.js';
import './BusRouteTracker.css';

const BusRouteTracker = () => {
    const [activeRoute, setActiveRoute] = useState(null);
    const [activeRouteId, setActiveRouteId] = useState(null);
    const [busLocations, setBusLocations] = useState([]);
    const [routeStations, setRouteStations] = useState([]);
    const [selectedDirection, setSelectedDirection] = useState('all');
    const [loading, setLoading] = useState(false);
    const [isPageVisible, setIsPageVisible] = useState(true);
    const [isUserActive, setIsUserActive] = useState(true);
    const activityTimeoutRef = React.useRef(null);

    const resetInactivityTimeout = () => {
        setIsUserActive(true);
        if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
        activityTimeoutRef.current = setTimeout(() => {
            console.log("[Route] Inactivity timeout reached (1m)");
            setIsUserActive(false);
        }, 60000); // 1 minute
    };

    // Handle User Activity
    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        const handleActivity = () => resetInactivityTimeout();

        events.forEach(event => document.addEventListener(event, handleActivity));
        resetInactivityTimeout(); // Initial start

        return () => {
            events.forEach(event => document.removeEventListener(event, handleActivity));
            if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
        };
    }, []);

    // Initial Search: Fetches everything (Stations + Locations)
    const handleSearch = async (routeNo, resetDirection = true) => {
        setLoading(true);
        setActiveRoute(routeNo);

        try {
            const routeId = await getRouteId(routeNo);
            if (routeId) {
                setActiveRouteId(routeId); // Store ID for polling

                // Fetch both locations and the full station list for the route
                const [locations, stations] = await Promise.all([
                    getRouteLocations(routeId),
                    getRouteStations(routeId)
                ]);

                console.log(`[Debug] Found ${locations.length} buses, ${stations.length} stations`);

                setRouteStations(stations);
                if (resetDirection) {
                    setSelectedDirection('all'); // Reset direction filter only for new searches
                }
                setBusLocations(locations.map((loc, idx) => ({
                    id: idx,
                    vehNo: loc.vehNo,
                    stationId: loc.stationId,
                    moveDir: loc.moveDir,
                    stationIdx: idx
                })));
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // Polling Update: Fetches ONLY Locations
    const updateRouteLocations = async () => {
        if (!activeRouteId) return;

        try {
            const locations = await getRouteLocations(activeRouteId);
            setBusLocations(locations.map((loc, idx) => ({
                id: idx,
                vehNo: loc.vehNo,
                stationId: loc.stationId,
                moveDir: loc.moveDir,
                stationIdx: idx
            })));
        } catch (error) {
            console.error("Polling update failed:", error);
        }
    };

    const handleReset = () => {
        setActiveRoute(null);
        setActiveRouteId(null);
        setBusLocations([]);
        setRouteStations([]);
    };

    const handleDirectionChange = async (direction) => {
        setSelectedDirection(direction);
        // Direction change is client-side filter only, no API recall needed usually
        // But if we want to refresh data:
        if (activeRouteId) {
            updateRouteLocations();
        }
    };

    // Handle Visibility Change
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(!document.hidden);
            if (!document.hidden) {
                console.log("[Route] Tab active, resuming polling");
                if (activeRouteId) updateRouteLocations();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [activeRouteId]);

    // 5-second Auto-refresh (Smart Polling)
    useEffect(() => {
        let intervalId;

        if (activeRouteId && isPageVisible && isUserActive) {
            console.log("[Route] Starting 5s polling for", activeRoute);
            intervalId = setInterval(() => {
                updateRouteLocations();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                console.log("[Route] Stopping polling");
                clearInterval(intervalId);
            }
        };
    }, [activeRouteId, isPageVisible, isUserActive]);


    // --- Filtering Logic for Display ---
    const getFilteredStations = () => {
        if (selectedDirection === 'all') return routeStations;
        return routeStations.filter(st => st.moveDir === selectedDirection);
    };

    const getFilteredBuses = () => {
        if (selectedDirection === 'all') return busLocations;
        return busLocations.filter(bus => bus.moveDir === selectedDirection);
    };

    const filteredStations = getFilteredStations();
    const filteredBuses = getFilteredBuses();

    return (
        <div className="bus-route-tracker-container" style={{ paddingBottom: '100px' }}>
            <div className="search-card">
                <div className="header">
                    <Search className="icon" />
                    <h1>실시간 버스 노선 검색</h1>
                </div>
                <RouteSearch
                    onSearch={handleSearch}
                    showReset={!!activeRoute}
                    onReset={handleReset}
                />
            </div>

            {activeRoute && (
                <div className="result-card animate-fadeIn">
                    <div className="header">
                        <Navigation className="icon" style={{ color: '#10b981' }} />
                        <h2 className="result-title">
                            {activeRoute}번 노선 추적
                        </h2>
                    </div>

                    <div className="direction-filter" style={{ marginBottom: '20px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                            className={`filter-btn ${selectedDirection === 'all' ? 'active' : ''}`}
                            onClick={() => handleDirectionChange('all')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #e5e7eb',
                                background: selectedDirection === 'all' ? '#4f46e5' : 'white',
                                color: selectedDirection === 'all' ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            전체
                        </button>
                        <button
                            className={`filter-btn ${selectedDirection === '0' ? 'active' : ''}`}
                            onClick={() => handleDirectionChange('0')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #e5e7eb',
                                background: selectedDirection === '0' ? '#4f46e5' : 'white',
                                color: selectedDirection === '0' ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            상행
                        </button>
                        <button
                            className={`filter-btn ${selectedDirection === '1' ? 'active' : ''}`}
                            onClick={() => handleDirectionChange('1')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #e5e7eb',
                                background: selectedDirection === '1' ? '#4f46e5' : 'white',
                                color: selectedDirection === '1' ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            하행
                        </button>
                    </div>

                    <div className="station-list">
                        {filteredStations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                정류장 정보를 불러오는 중이거나 데이터가 없습니다.
                            </div>
                        ) : (
                            filteredStations.map((station, index) => {
                                const busesHere = filteredBuses.filter(b => b.stationId === station.bsId);

                                return (
                                    <div key={index} className="station-item" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 0',
                                        borderBottom: '1px solid #f3f4f6',
                                        position: 'relative'
                                    }}>
                                        <div className="line-connector" style={{
                                            position: 'absolute',
                                            left: '24px',
                                            top: '0',
                                            bottom: '0',
                                            width: '2px',
                                            background: '#e5e7eb',
                                            zIndex: 0
                                        }}></div>

                                        <div className="station-node" style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: busesHere.length > 0 ? '#ef4444' : 'white',
                                            border: `2px solid ${busesHere.length > 0 ? '#ef4444' : '#d1d5db'}`,
                                            margin: '0 19px',
                                            zIndex: 1,
                                            position: 'relative'
                                        }}></div>

                                        <div className="station-info" style={{ flex: 1, paddingLeft: '12px' }}>
                                            <div style={{ fontWeight: '600', color: '#1f2937' }}>{station.stationNm}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{station.bsId}</div>
                                        </div>

                                        {busesHere.map(bus => (
                                            <div key={bus.id} className="bus-icon" style={{
                                                position: 'absolute',
                                                left: '10px',
                                                zIndex: 2,
                                                background: '#ef4444',
                                                color: 'white',
                                                borderRadius: '12px',
                                                padding: '2px 8px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                                            }}>
                                                <span>🚌</span>
                                                <span>{bus.vehNo.slice(-4)}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusRouteTracker;
