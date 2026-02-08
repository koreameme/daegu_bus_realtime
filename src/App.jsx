import React, { useState } from 'react';
import StationArrivals from './components/StationArrivals.jsx';
import BusRouteTracker from './components/BusRouteTracker.jsx';
import AboutPage from './components/AboutPage.jsx';
import BottomNav from './components/BottomNav.jsx';

function App() {
    const [activeTab, setActiveTab] = useState('timetable'); // Default to Timetable

    console.log('[App] Current Active Tab:', activeTab); // Debug Log

    const renderContent = () => {
        switch (activeTab) {
            case 'timetable':
                return <StationArrivals />;
            case 'realtime':
                return <BusRouteTracker />;
            case 'about':
                return <AboutPage />;
            default:
                return <StationArrivals />;
        }
    };

    return (
        <div className="App">
            <div className="content-area">
                {renderContent()}
            </div>
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

export default App;
