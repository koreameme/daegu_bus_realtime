import React, { useState, useEffect } from 'react';
import RouteSearch from './RouteSearch.jsx';
import { getBusArrivals, getRouteId, getRouteLocations } from '../services/api_service.js';
import '../styles/BusArrival.css';

const FIXED_STATIONS = [
    '대구역', '중앙로역', '반월당역', '명덕역', '교대역',
    '영대병원역', '현충로역', '안지랑역', '대명역', '서부정류장역'
];

const RealTimeDashboard = () => {
    const [viewType, setViewType] = useState('station'); // 'station' or 'route'
    const [activeRoute, setActiveRoute] = useState(null);
    const [busLocations, setBusLocations] = useState([]);
    const [stationArrivals, setStationArrivals] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (routeNo) => {
        setLoading(true);
        setViewType('route');
        setActiveRoute(routeNo);

        try {
            const routeId = await getRouteId(routeNo);
            if (routeId) {
                const locations = await getRouteLocations(routeId);
                setBusLocations(locations.map((loc, idx) => ({
                    id: idx,
                    vehNo: loc.vehNo,
                    stationName: loc.stationNm,
                    stationIdx: idx
                })));
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArrivals = async () => {
        setLoading(true);
        setViewType('station');
        setActiveRoute(null);
        try {
            const arrivals = await getBusArrivals('00192'); // 대구역 default
            setStationArrivals(arrivals.map(arr => ({
                routeNo: arr.routeNo,
                arrTime: parseInt(arr.arrTime),
                arrPrevStationCnt: parseInt(arr.arrPrevStationCnt)
            })));
        } catch (error) {
            console.error("Fetch arrivals failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        fetchArrivals();
    };

    // 2-second Auto-refresh
    useEffect(() => {
        const interval = setInterval(() => {
            if (viewType === 'station') {
                fetchArrivals();
            } else if (viewType === 'route' && activeRoute) {
                handleSearch(activeRoute);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [viewType, activeRoute]);

    useEffect(() => {
        fetchArrivals();
    }, []);

    return (
        <div className="bus-arrival-container">
            <div style={{ marginBottom: '20px' }}>
                <RouteSearch
                    onSearch={handleSearch}
                    showReset={viewType === 'route'}
                    onReset={handleReset}
                />
            </div>

            <div className="real-time-header">
                <h2>
                    {viewType === 'station' ? '반경 실시간 도착' : `${activeRoute}번 노선 추적`}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(52, 199, 89, 0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                        <div className="live-pulse"></div>
                        <span style={{ fontSize: '0.75rem', color: '#34c759', fontWeight: '900', letterSpacing: '0.5px' }}>LIVE</span>
                    </div>
                </div>
            </div>

            {loading && stationArrivals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#86868b' }}>
                    실시간 데이터를 불러오는 중...
                </div>
            ) : viewType === 'station' ? (
                <div className="arrival-list">
                    {stationArrivals.length > 0 ? (
                        stationArrivals.map((bus, index) => (
                            <div key={index} className="bus-card">
                                <div className="bus-info-main">
                                    <div className="bus-route-no" style={{ color: '#ff3b30' }}>{bus.routeNo}</div>
                                    <div className="bus-station-info">{bus.arrPrevStationCnt} 정류장 전</div>
                                </div>
                                <div className="bus-arrival-time">
                                    <div className="time-value">{Math.floor(bus.arrTime / 60)}분</div>
                                    <div className="time-unit">후 도착</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.03)', borderRadius: '20px', color: '#86868b' }}>
                            현재 대구역 주변에 운행 중인 버스가 어둡습니다.
                        </div>
                    )}
                </div>
            ) : (
                <div className="route-map-container">
                    <div className="route-track"></div>
                    {FIXED_STATIONS.map((station, idx) => {
                        const busesAtThisStation = busLocations.filter(b => b.stationName === station);
                        return (
                            <div key={idx} className={`station-item ${busesAtThisStation.length > 0 ? 'active' : ''}`}>
                                <div className="station-marker"></div>
                                <div className="station-name">{station}</div>
                                <div className="bus-tags-container">
                                    {busesAtThisStation.map((bus, bIdx) => (
                                        <div key={`${bus.id}-${bIdx}`} className="bus-label">
                                            {bus.vehNo}
                                        </div>
                                    ))}
                                </div>
                                {busesAtThisStation.map((bus, bIdx) => (
                                    <div key={`icon-${bus.id}-${bIdx}`} className="bus-icon-marker">
                                        🚌
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default RealTimeDashboard;
