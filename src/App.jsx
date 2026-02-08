import React, { useState } from 'react';
import StationArrivals from './components/StationArrivals.jsx';
import BusRouteTracker from './components/BusRouteTracker.jsx';
import AboutPage from './components/AboutPage.jsx';
import BottomNav from './components/BottomNav.jsx';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('timetable'); // Default to Timetable
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Filter threshold for swipe detection
    const minSwipeDistance = 30; // Reduced for better sensitivity
    const tabOrder = ['timetable', 'realtime', 'about'];

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const onTouchMove = (e) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;

        // Ensure it's more horizontal than vertical
        const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY) * 1.5;

        if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
            const currentIndex = tabOrder.indexOf(activeTab);
            if (distanceX > 0) {
                // Swipe Left -> Next Tab
                if (currentIndex < tabOrder.length - 1) {
                    setActiveTab(tabOrder[currentIndex + 1]);
                }
            } else {
                // Swipe Right -> Previous Tab
                if (currentIndex > 0) {
                    setActiveTab(tabOrder[currentIndex - 1]);
                }
            }
        }

        // Reset state
        setTouchStart(null);
        setTouchEnd(null);
    };

    console.log('[App] Current Active Tab:', activeTab); // Debug Log

    return (
        <div className="App">
            <div
                className="content-container"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
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
