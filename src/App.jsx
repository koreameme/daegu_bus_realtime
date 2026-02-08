import React, { useState } from 'react';
import StationArrivals from './components/StationArrivals.jsx';
import BusRouteTracker from './components/BusRouteTracker.jsx';
import AboutPage from './components/AboutPage.jsx';
import BottomNav from './components/BottomNav.jsx';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('timetable'); // Default to Timetable

    console.log('[App] Current Active Tab:', activeTab); // Debug Log

    return (
        <div className="App">
            <div className="content-container">
                <div className={`tabs-slider ${activeTab}`}>
                    <div className="tab-pane">
                        <StationArrivals />
                    </div>
                    <div className="tab-pane">
                        <BusRouteTracker />
                    </div>
                    <div className="tab-pane">
                        <AboutPage />
                    </div>
                </div>
            </div>
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

export default App;
