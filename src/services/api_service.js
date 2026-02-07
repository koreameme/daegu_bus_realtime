import axios from 'axios';

// Use Vite environment variables (requires VITE_ prefix in .env)
const SERVICE_KEY = import.meta.env.VITE_DAEGU_BUS_SERVICE_KEY;
const BASE_URL = 'https://apis.data.go.kr/6270000/dbmsapi02';

// Cache configuration
const CACHE_KEY = 'daegu_bus_routes_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get cached routes from localStorage
 */
function getCachedRoutes() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { timestamp, routes } = JSON.parse(cached);

        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('[Cache] Using cached route data');
            return routes;
        } else {
            console.log('[Cache] Cache expired, will fetch fresh data');
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
    } catch (error) {
        console.warn('[Cache] Error reading cache:', error);
        return null;
    }
}

/**
 * Save routes to localStorage cache
 */
function setCachedRoutes(routes) {
    try {
        const cacheData = {
            timestamp: Date.now(),
            routes: routes
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log(`[Cache] Saved ${routes.length} routes to cache`);
    } catch (error) {
        console.warn('[Cache] Error saving cache:', error);
    }
}

/**
 * Fetches real-time bus arrival information for a specific stop.
 */
async function getBusArrivals(stopId) {
    if (!SERVICE_KEY) throw new Error('DAEGU_BUS_SERVICE_KEY missing');

    const url = `${BASE_URL}/getRealtime02?serviceKey=${SERVICE_KEY}&bsId=${stopId}&pageNo=1&numOfRows=10`;

    try {
        const response = await axios.get(url);
        // The new API usually returns JSON by default or we can force it.
        // It seems the user's sample was JSON.
        const data = response.data;

        if (data.header?.resultCode !== '0000') {
            throw new Error(`API Error: ${data.header?.resultMsg}`);
        }

        const items = data.body?.items;
        if (!items) return [];

        // Map new fields to match existing UI
        return items.map(item => ({
            routeNo: item.routeNo,
            arrTime: item.arrTime,
            arrPrevStationCnt: item.bsGap || 0,
            routeId: item.routeId
        }));

    } catch (error) {
        console.warn(`[WARNING] API call failed. Returning mock data. Error: ${error.message}`);
        return [
            { routeNo: '급행1', arrTime: 320, arrPrevStationCnt: 2 },
            { routeNo: '401', arrTime: 540, arrPrevStationCnt: 4 },
            { routeNo: '708', arrTime: 900, arrPrevStationCnt: 7 }
        ];
    }
}

/**
 * Searches for a route by number and returns its ID.
 * Uses localStorage cache to avoid repeated API calls.
 */
async function getRouteId(routeNo) {
    if (!SERVICE_KEY) throw new Error('DAEGU_BUS_SERVICE_KEY missing');

    // Try cache first
    const cachedRoutes = getCachedRoutes();
    if (cachedRoutes) {
        const target = cachedRoutes.find(r => r.routeNo === routeNo);
        if (target) {
            console.log(`[Cache Hit] Found route ${routeNo} -> ${target.routeId}`);
            return target.routeId;
        }
    }

    // Cache miss - fetch from API
    console.log('[Cache Miss] Fetching all routes from API...');
    const url = `${BASE_URL}/getBasic02?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10000`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        const routes = data.body?.items?.route || [];

        // Save to cache for future use
        if (routes.length > 0) {
            setCachedRoutes(routes);
        }

        const target = routes.find(r => r.routeNo === routeNo);
        return target ? target.routeId : null;
    } catch (error) {
        console.warn(`[Mock] Route search failed. Using mock routeId.`);
        if (routeNo.includes('급행1')) return '1000001074';
        if (routeNo.includes('401')) return '1000000401';
        return 'MOCK_ID';
    }
}

/**
 * Fetches real-time bus locations for a specific route.
 */
async function getRouteLocations(routeId) {
    if (!SERVICE_KEY) throw new Error('DAEGU_BUS_SERVICE_KEY missing');

    const url = `${BASE_URL}/getPos02?serviceKey=${SERVICE_KEY}&routeId=${routeId}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const items = data.body?.items || [];
        return items.map(item => ({
            vehNo: item.vhcNo || item.vhcNo2 || '알 수 없음',
            stationNm: item.bsNm || '정보 없음',
            stationId: item.bsId,
            moveDir: item.moveDir,
            arrPrevStationCnt: item.bsGap || 0,
            x: item.xPos,
            y: item.yPos
        }));
    } catch (error) {
        console.warn(`[Mock] Location fetch failed. Using mock positions.`);
        return [
            { vehNo: '대구70자 1234', stationNm: '대구역', arrPrevStationCnt: 1 },
            { vehNo: '대구70자 5678', stationNm: '중앙로역', arrPrevStationCnt: 4 }
        ];
    }
}

/**
 * Fetches the list of stations for a specific route.
 */
async function getRouteStations(routeId) {
    if (!SERVICE_KEY) throw new Error('DAEGU_BUS_SERVICE_KEY missing');

    const url = `${BASE_URL}/getBs02?serviceKey=${SERVICE_KEY}&routeId=${routeId}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        const items = data.body?.items || [];

        return items.map(item => ({
            stationNm: item.bsNm,
            bsId: item.bsId,
            moveDir: item.moveDir,
            seq: item.seq,
            x: item.xPos,
            y: item.yPos
        }));
    } catch (error) {
        console.warn(`[Mock] Station list fetch failed. Using mock stations.`);
        return [
            { stationNm: '대구역', bsId: '7031011500' },
            { stationNm: '중앙로역', bsId: '7031011600' },
            { stationNm: '반월당역', bsId: '7031011700' }
        ];
    }
}

export {
    getBusArrivals,
    getRouteId,
    getRouteLocations,
    getRouteStations
};
