import requests
import xml.etree.ElementTree as ET
import urllib.parse

# User provided API key
SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"

def test_route_apis():
    # 1. Search for a route number to get routeId
    # Common Daegu route: '급행1'
    route_no = '급행1'
    route_search_url = "http://apis.data.go.kr/6270000/dgBusRouteService/getBusRouteList"
    
    print(f"--- Step 1: Searching for Route {route_no} ---")
    try:
        # Use unquoted key for reliability
        manual_url = f"{route_search_url}?serviceKey={SERVICE_KEY}&pageNo=1&numOfRows=10&routeNo={urllib.parse.quote(route_no)}"
        response = requests.get(manual_url)
        print(f"Status: {response.status_code}")
        print("Full Response Body:", response.text)
        
        if response.status_code == 200 and "<response>" in response.text:
            root = ET.fromstring(response.content)
            items = root.findall('.//item')
            if items:
                # Get the routeId of the first match
                route_id = items[0].find('routeId').text
                print(f"Successfully found routeId for {route_no}: {route_id}")
                
                # 2. Get real-time bus locations for this routeId
                print(f"\n--- Step 2: Fetching Locations for routeId {route_id} ---")
                location_url = "http://apis.data.go.kr/6270000/dgBusLocationService/getBusLocationList"
                loc_manual_url = f"{location_url}?serviceKey={SERVICE_KEY}&routeId={route_id}"
                
                loc_response = requests.get(loc_manual_url)
                print(f"Loc Status: {loc_response.status_code}")
                print("Loc Response Sample:", loc_response.text[:500])
                
                if loc_response.status_code == 200 and "<response>" in loc_response.text:
                    loc_root = ET.fromstring(loc_response.content)
                    loc_items = loc_root.findall('.//item')
                    print(f"Found {len(loc_items)} buses currently running on route {route_no}.")
                    for idx, item in enumerate(loc_items):
                        veh_no = item.find('vehNo').text
                        station_nm = item.find('stationNm').text
                        print(f"[{idx+1}] Vehicle: {veh_no} at {station_nm}")
            else:
                print(f"No route found for {route_no}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_route_apis()
