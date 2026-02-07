import requests

SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"
BASE_URL = "https://apis.data.go.kr/6270000/dbmsapi02"

functions = [
    ("getRealtime02", {"bsId": "7001001400"}), # Arrival info
    ("getBs02", {"routeId": "DGB20000001"}),    # Stations by route
    ("getPos02", {"routeId": "DGB20000001"}),   # Bus positions
    ("getBasic02", {}),                          # Basic info
]

def test_new_endpoints():
    for func, params in functions:
        url = f"{BASE_URL}/{func}?serviceKey={SERVICE_KEY}"
        for k, v in params.items():
            url += f"&{k}={v}"
        url += "&pageNo=1&numOfRows=1"
        
        try:
            r = requests.get(url, timeout=5)
            print(f"[{func}] Status: {r.status_code}")
            print(f"[{func}] Response: {r.text[:200]}")
        except Exception as e:
            print(f"[{func}] Error: {e}")
        print("-" * 20)

if __name__ == "__main__":
    test_new_endpoints()
