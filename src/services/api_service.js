import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

// Use Vite environment variables (requires VITE_ prefix in .env)
const SERVICE_KEY = import.meta.env.VITE_DAEGU_BUS_SERVICE_KEY;
const ARRIVAL_URL = 'https://apis.data.go.kr/6270000/dgBusArriveService/getBusArriveInfoList';
const ROUTE_URL = 'https://apis.data.go.kr/6270000/dgBusRouteService/getBusRouteList';
const LOCATION_URL = 'https://apis.data.go.kr/6270000/dgBusLocationService/getBusLocationList';

/**
 * Fetches real-time bus arrival information for a specific stop.
 * @param {string} stopId - The unique ID of the bus stop.
 * @returns {Promise<Array>} - A list of arriving bus information.
 */
async function getBusArrivals(stopId) {
    if (!SERVICE_KEY) {
        throw new Error('DAEGU_BUS_SERVICE_KEY is not defined in .env');
    }

    // CRITICAL: We construct the URL manually with the RAW service key 
    // to avoid double-encoding issues (which cause 500/Auth errors).
    const requestUrl = `${ARRIVAL_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&stopId=${stopId}`;
    console.log(`[DEBUG] Requesting: ${requestUrl}`);

    try {
        const response = await axios.get(requestUrl);
        console.log(`[DEBUG] Response Status: ${response.status}`);
        console.log(`[DEBUG] Raw Response: ${String(response.data).substring(0, 200)}...`);

        // Public API usually returns XML by default or if requested.
        // We parse it to a clean JSON object.
        const parser = new XMLParser();
        const jsonObj = parser.parse(response.data);

        const header = jsonObj.response?.header;
        if (header?.resultCode !== '00') {
            throw new Error(`API Error: ${header?.resultMsg || 'Unknown error'}`);
        }

        const items = jsonObj.response?.body?.items?.item;

        // Handle both single item (object) and multiple items (array)
        if (!items) return [];
        return Array.isArray(items) ? items : [items];

    } catch (error) {
        console.warn(`[WARNING] API call failed for stop ${stopId}. Returning mock data for development. Error: ${error.message}`);

        // Mock fallback data for development
        return [
            { routeNo: '급행1', arrTime: 320, arrPrevStationCnt: 2 },
            { routeNo: '401', arrTime: 540, arrPrevStationCnt: 4 },
            { routeNo: '708', arrTime: 900, arrPrevStationCnt: 7 }
        ];
    }
}

/**
 * Searches for a route by number and returns its ID.
 * @param {string} routeNo - The bus route number (e.g., '급행1').
 * @returns {Promise<string|null>} - The route ID.
 */
async function getRouteId(routeNo) {
    if (!SERVICE_KEY) throw new Error('DAEGU_BUS_SERVICE_KEY missing');

    // Encode routeNo for URL
    const encodedRouteNo = encodeURIComponent(routeNo);
    const requestUrl = `${ROUTE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&routeNo=${encodedRouteNo}`;

    try {
        const response = await axios.get(requestUrl);
        const parser = new XMLParser();
        const jsonObj = parser.parse(response.data);

        const items = jsonObj.response?.body?.items?.item;
        if (!items) return null;

        const item = Array.isArray(items) ? items[0] : items;
        return item.routeId;
    } catch (error) {
        console.warn(`[Mock] Route search failed for ${routeNo}. Using mock routeId.`);
        // Mock fallback for common routes
        if (routeNo.includes('급행1')) return 'DGB20000001';
        if (routeNo.includes('401')) return 'DGB30000401';
        return 'DGB-MOCK-ID';
    }
}

/**
 * Fetches real-time bus locations for a specific route.
 * @param {string} routeId - The unique ID of the route.
 * @returns {Promise<Array>} - List of active bus locations.
 */
async function getRouteLocations(routeId) {
    if (!SERVICE_KEY) throw new Error('DAEGU_BUS_SERVICE_KEY missing');

    const requestUrl = `${LOCATION_URL}?serviceKey=${SERVICE_KEY}&routeId=${routeId}`;

    try {
        const response = await axios.get(requestUrl);
        const parser = new XMLParser();
        const jsonObj = parser.parse(response.data);

        const items = jsonObj.response?.body?.items?.item;
        if (!items) return [];
        return Array.isArray(items) ? items : [items];
    } catch (error) {
        console.warn(`[Mock] Location fetch failed for ${routeId}. Using mock positions.`);
        return [
            { vehNo: '대구70자 1234', stationNm: '대구역', arrPrevStationCnt: 1 },
            { vehNo: '대구70자 5678', stationNm: '중앙로역', arrPrevStationCnt: 4 },
            { vehNo: '대구70자 9012', stationNm: '반월당역', arrPrevStationCnt: 7 }
        ];
    }
}

export {
    getBusArrivals,
    getRouteId,
    getRouteLocations
};
