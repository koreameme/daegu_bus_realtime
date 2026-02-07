import axios from 'axios';

const SERVICE_KEY = process.env.VITE_DAEGU_BUS_SERVICE_KEY;
const BASE_URL = 'https://apis.data.go.kr/6270000/dbmsapi02';

async function testRoute937() {
    console.log('Testing route 937...\n');

    // Step 1: Get route ID
    const basicUrl = `${BASE_URL}/getBasic02?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10000`;
    const basicResponse = await axios.get(basicUrl);
    const routes = basicResponse.data.body?.items?.route || [];
    const route937 = routes.find(r => r.routeNo === '937');

    if (!route937) {
        console.log('❌ Route 937 not found!');
        return;
    }

    console.log('✅ Route 937 found:', route937);
    console.log('Route ID:', route937.routeId);
    console.log('');

    // Step 2: Get bus locations
    const posUrl = `${BASE_URL}/getPos02?serviceKey=${SERVICE_KEY}&routeId=${route937.routeId}`;
    const posResponse = await axios.get(posUrl);
    const locations = posResponse.data.body?.items || [];

    console.log(`📍 Bus locations (${locations.length} buses):`);
    locations.forEach((loc, idx) => {
        console.log(`  Bus ${idx + 1}:`, {
            vehNo: loc.vhcNo || loc.vhcNo2,
            stationId: loc.bsId,
            stationName: loc.bsNm,
            moveDir: loc.moveDir
        });
    });
    console.log('');

    // Step 3: Get stations
    const stationUrl = `${BASE_URL}/getBs02?serviceKey=${SERVICE_KEY}&routeId=${route937.routeId}`;
    const stationResponse = await axios.get(stationUrl);
    const stations = stationResponse.data.body?.items || [];

    console.log(`🚏 Stations (${stations.length} stations):`);
    console.log('First 5 stations:');
    stations.slice(0, 5).forEach((station, idx) => {
        console.log(`  ${idx + 1}. ${station.bsNm} (ID: ${station.bsId}, Dir: ${station.moveDir})`);
    });
    console.log('');

    // Step 4: Check matching
    console.log('🔍 Matching analysis:');
    let matchCount = 0;
    locations.forEach(loc => {
        const matchingStation = stations.find(s => s.bsId === loc.bsId);
        if (matchingStation) {
            matchCount++;
            console.log(`  ✅ Bus ${loc.vhcNo || loc.vhcNo2} matched to station: ${matchingStation.bsNm}`);
        } else {
            console.log(`  ❌ Bus ${loc.vhcNo || loc.vhcNo2} NOT matched (stationId: ${loc.bsId})`);
        }
    });

    console.log(`\n📊 Summary: ${matchCount}/${locations.length} buses matched to stations`);
}

testRoute937().catch(console.error);
