
import React, { useState, useMemo } from 'react';
import { Bus, Calendar, Search, Clock, MapPin } from 'lucide-react';
import { busScheduleData, detailedScheduleData } from '../data/scheduleData';
import './HanilTimetable.css';

const HanilTimetable = () => {
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedNumber, setSelectedNumber] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    // Get unique routes
    const routes = useMemo(() => {
        return [...new Set(busScheduleData.map(item => item.노선번호))];
    }, []);

    // Get days for selected route
    const days = useMemo(() => {
        if (!selectedRoute) return [];
        return busScheduleData
            .filter(item => item.노선번호 === selectedRoute)
            .map(item => item.요일);
    }, [selectedRoute]);

    // Get numbers for selected route and day
    const numbers = useMemo(() => {
        if (!selectedRoute || !selectedDay) return [];
        const schedule = busScheduleData.find(
            item => item.노선번호 === selectedRoute && item.요일 === selectedDay
        );
        return schedule ? schedule.상세운행.map(item => item.순번) : [];
    }, [selectedRoute, selectedDay]);

    const handleRouteChange = (e) => {
        setSelectedRoute(e.target.value);
        setSelectedDay('');
        setSelectedNumber('');
        setSearchResult(null);
    };

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
        setSelectedNumber('');
        setSearchResult(null);
    };

    const handleNumberChange = (e) => {
        setSelectedNumber(e.target.value);
        setSearchResult(null);
    };

    const handleSearch = () => {
        if (!selectedRoute || !selectedDay || !selectedNumber) return;

        const schedule = busScheduleData.find(
            item => item.노선번호 === selectedRoute && item.요일 === selectedDay
        );

        if (schedule) {
            const detail = schedule.상세운행.find(item => item.순번 === parseInt(selectedNumber));
            const dayMapping = {
                '평일': '평일',
                '토요일,방학': '토요일',
                '휴일': '휴일',
                '평,토,휴일': '평,토,휴일'
            };
            const mappedDay = dayMapping[selectedDay] || selectedDay;
            const routeSchedule = detailedScheduleData[selectedRoute];
            let detailedInfo = null;

            if (routeSchedule && routeSchedule[mappedDay]) {
                const scheduleForNumber = routeSchedule[mappedDay].배차_데이터.find(
                    item => item.순번 === parseInt(selectedNumber)
                );
                if (scheduleForNumber) {
                    detailedInfo = {
                        stops: routeSchedule[mappedDay].정류장_목록,
                        turns: scheduleForNumber.회차
                    };
                }
            }

            setSearchResult({
                detail,
                detailedInfo
            });
        }
    };

    const handleReset = () => {
        setSelectedRoute('');
        setSelectedDay('');
        setSelectedNumber('');
        setSearchResult(null);
    };

    return (
        <div className="hanil-timetable-container">
            <div className="search-card">
                <div className="header">
                    <Bus className="icon" />
                    <h1>한일 버스 운행 시간표</h1>
                </div>

                <div className="search-grid">
                    <div className="form-group">
                        <label>노선 선택</label>
                        <select value={selectedRoute} onChange={handleRouteChange}>
                            <option value="">선택하세요</option>
                            {routes.map(route => (
                                <option key={route} value={route}>{route}번</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>
                            <Calendar style={{ width: '1rem', height: '1rem' }} />
                            요일
                        </label>
                        <select
                            value={selectedDay}
                            onChange={handleDayChange}
                            disabled={!selectedRoute}
                        >
                            <option value="">선택하세요</option>
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>순번</label>
                        <select
                            value={selectedNumber}
                            onChange={handleNumberChange}
                            disabled={!selectedDay}
                        >
                            <option value="">선택하세요</option>
                            {numbers.map(num => (
                                <option key={num} value={num}>{num}번</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="button-group">
                    <button
                        className="search-btn"
                        onClick={handleSearch}
                        disabled={!selectedRoute || !selectedDay || !selectedNumber}
                    >
                        <Search style={{ width: '1.25rem', height: '1.25rem' }} />
                        조회하기
                    </button>
                    <button className="reset-btn" onClick={handleReset}>
                        초기화
                    </button>
                </div>
            </div>

            {searchResult && (
                <div className="result-section">
                    <div className="result-card animate-fadeIn">
                        <div className="header">
                            <Clock style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5' }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>근무 시간 정보</h2>
                        </div>
                        <div className="info-cards">
                            <div className="info-card blue">
                                <div className="info-card-label">오전 근무</div>
                                <div className="info-card-time">{searchResult.detail.오전근무}</div>
                            </div>
                            <div className="info-card amber">
                                <div className="info-card-label">교대 시간</div>
                                <div className="info-card-time">{searchResult.detail.교대시간}</div>
                            </div>
                            <div className="info-card purple">
                                <div className="info-card-label">오후 근무</div>
                                <div className="info-card-time">{searchResult.detail.오후근무}</div>
                            </div>
                        </div>
                        <div className="meta-info">
                            <span>노선:</span> {selectedRoute}번 |
                            <span>요일:</span> {selectedDay} |
                            <span>순번:</span> {selectedNumber}번
                        </div>
                    </div>

                    {searchResult.detailedInfo && (
                        <div className="detail-table-card animate-fadeIn">
                            <div className="header">
                                <MapPin style={{ width: '1.5rem', height: '1.5rem', color: '#10b981' }} />
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>상세 시간표</h2>
                            </div>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>회차</th>
                                            {searchResult.detailedInfo.stops.map((stop, idx) => (
                                                <th key={idx}>{stop}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResult.detailedInfo.turns.map((turn, idx) => (
                                            <tr key={idx}>
                                                <td className="turn-number">{turn.번호}회</td>
                                                {turn.시간.map((time, tIdx) => (
                                                    <td key={tIdx} className={`time-cell ${time === '-' ? 'empty' : ''}`}>
                                                        {time}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="notice">
                                <span>💡 안내:</span> 각 회차별로 정류장을 거쳐가는 시간이 표시됩니다.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HanilTimetable;
