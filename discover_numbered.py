import requests

SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"
BASE_URL = "https://apis.data.go.kr/6270000/dbmsapi02"

# More exhaustive list based on Daegu's newer conventions
# Often they use numbered or slightly different names
candidates = [
    "getRealtime02",
    "getRoute02",
    "getBusLocation02",
    "getBusStation02",
    "getBusRoute02",
    "getStation02",
    "getArrive02",
    "getLine02",
    "getBusInfo02",
    "getRoutePos02",
    "getStationPos02",
    "getBusPos02"
]

def discover():
    for func in candidates:
        url = f"{BASE_URL}/{func}?serviceKey={SERVICE_KEY}&pageNo=1&numOfRows=1"
        try:
            r = requests.get(url, timeout=3)
            print(f"[{func}] Status: {r.status_code}, Snippet: {r.text[:60]}")
        except:
            pass

if __name__ == "__main__":
    discover()
