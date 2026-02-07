import requests
import json

SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"
BASE_URL = "https://apis.data.go.kr/6270000/dbmsapi02"

def discover_ids():
    # 1. Get Route ID for '급행1'
    url = f"{BASE_URL}/getBasic02?serviceKey={SERVICE_KEY}&pageNo=1&numOfRows=10000"
    r = requests.get(url)
    data = r.json()
    
    routes = data['body']['items'].get('route', [])
    target_route = next((r for r in routes if r['routeNo'] == '급행1'), None)
    
    if target_route:
        print(f"Found Route: {target_route}")
        route_id = target_route['routeId']
        
        # 2. Get Bus Positions for this route
        pos_url = f"{BASE_URL}/getPos02?serviceKey={SERVICE_KEY}&routeId={route_id}"
        r_pos = requests.get(pos_url)
        print(f"Bus Positions for {route_id}: {r_pos.text[:500]}")
        
        # 3. Get Stations for this route
        bs_url = f"{BASE_URL}/getBs02?serviceKey={SERVICE_KEY}&routeId={route_id}"
        r_bs = requests.get(bs_url)
        print(f"Stations for {route_id}: {r_bs.text[:500]}")
        
    else:
        print("Route '급행1' not found in first 10000 items.")

if __name__ == "__main__":
    discover_ids()
