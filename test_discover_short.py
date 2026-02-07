import requests

SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"
BASE_URL = "https://apis.data.go.kr/6270000/dbmsapi02"

# More candidates based on newer naming conventions
functions = [
    "getArriveInfoList",
    "getArriveInfo",
    "getBusArrive",
    "arriveInfo",
    "busArriveInfo",
    "getRouteList",
    "routeList",
    "routeInfo",
    "getStationList",
    "getBusStation",
    "stationInfo"
]

def test_functions():
    for func in functions:
        url = f"{BASE_URL}/{func}?serviceKey={SERVICE_KEY}&pageNo=1&numOfRows=1"
        try:
            r = requests.get(url, timeout=5)
            print(f"[{func}] Status: {r.status_code}, Snippet: {r.text[:50]}")
        except Exception as e:
            print(f"[{func}] Error: {e}")

if __name__ == "__main__":
    test_functions()
