import requests
import json

SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"
BASE_URL = "https://apis.data.go.kr/6270000/dbmsapi02/getBasic02"

def analyze_basic():
    url = f"{BASE_URL}?serviceKey={SERVICE_KEY}&pageNo=1&numOfRows=1"
    try:
        r = requests.get(url, timeout=10)
        data = r.json()
        print("Keys in body.items:", data['body']['items'].keys())
        
        # Check first station
        if 'bs' in data['body']['items']:
            print("Station sample:", data['body']['items']['bs'][0])
            
        # Check if there's a route key
        if 'route' in data['body']['items']:
            print("Route sample:", data['body']['items']['route'][0])
        else:
            # Try a larger sample to find 'route'
            url_more = f"{BASE_URL}?serviceKey={SERVICE_KEY}&pageNo=1&numOfRows=1000"
            r2 = requests.get(url_more, timeout=20)
            data2 = r2.json()
            print("Keys in larger body.items:", data2['body']['items'].keys())
            if 'route' in data2['body']['items']:
                print("Route sample found in larger set:", data2['body']['items']['route'][0])
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_basic()
