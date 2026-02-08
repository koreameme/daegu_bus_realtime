import React from 'react';

const AboutPage = () => {
    return (
        <div style={{ padding: '24px', paddingTop: '20px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px', color: '#1c1c1e' }}>
                소개
            </h1>

            <div style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                marginBottom: '20px'
            }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', color: '#007aff' }}>
                    대구 버스 리얼타임
                </h2>
                <p style={{ lineHeight: '1.6', color: '#3a3a3c', marginBottom: '16px' }}>
                    이 앱은 대구광역시의 시내버스 실시간 운행 정보를 제공합니다.
                    정류장 별 도착 정보와 노선 별 버스 위치를 확인할 수 있습니다.
                </p>
                <div style={{ fontSize: '0.9rem', color: '#8e8e93' }}>
                    버전 1.0.0
                </div>
            </div>

            <div style={{
                background: '#f2f2f7',
                borderRadius: '24px',
                padding: '24px'
            }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>
                    제공 기능
                </h3>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#3a3a3c' }}>
                    <li>실시간 도착 예정 시간 조회</li>
                    <li>버스 노선별 실시간 위치 추적</li>
                    <li>상행/하행 노선 필터링</li>
                    <li>백그라운드 데이터 절약 모드</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;
