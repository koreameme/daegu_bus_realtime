import requests

SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"
STATION_URL = "https://apis.data.go.kr/6270000/dgBusStationService/getStationList"

def test_api():
    params = {
        'serviceKey': SERVICE_KEY,
        'stationNm': '대구역',
        'pageNo': 1,
        'numOfRows': 1
    }
    
    print(f"Testing URL: {STATION_URL}")
    print(f"Params: {params}")
    
    try:
        # We use the raw key to avoid double encoding by requests
        # However, requests.get encodes params. Let's try manually.
        url = f"{STATION_URL}?serviceKey={SERVICE_KEY}&stationNm=%EB%8C%80%EA%B5%AC%EC%97%AD&pageNo=1&numOfRows=1"
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {response.headers}")
        print(f"Content: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
