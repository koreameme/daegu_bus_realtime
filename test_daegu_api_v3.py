import requests
import urllib.parse

# User provided API key
SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"

def test_daegu_bus_api():
    # Attempt 1: Using the key as is (requests will encode it by default)
    # Attempt 2: Using the key with manual unquoting if needed
    # Endpoint for Daegu Bus Arrival information
    url = "http://apis.data.go.kr/6270000/dgBusArriveService/getBusArriveInfoList"
    
    # Common stopIds for Daegu: '00192', '00611', etc.
    stop_id = '00192' 

    print(f"--- Attempting with Provided Key (Default Encoding) ---")
    params = {
        'serviceKey': SERVICE_KEY,
        'pageNo': '1',
        'numOfRows': '10',
        'stopId': stop_id
    }
    
    try:
        # We manually build the URL to prevent double encoding if needed
        # But first let's try the standard requests way
        response = requests.get(url, params=params)
        print(f"Status: {response.status_code}")
        print(f"Content: {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

    print(f"\n--- Attempting with Unquoted Key (Manual URL building) ---")
    try:
        # Some APIs on Public Data Portal fail if the key is URL-encoded by the library
        # We use a literal string for the service key in the URL
        unquoted_key = urllib.parse.unquote(SERVICE_KEY)
        manual_url = f"{url}?serviceKey={SERVICE_KEY}&pageNo=1&numOfRows=10&stopId={stop_id}"
        print(f"Manual URL (sample): {manual_url[:100]}...")
        
        response = requests.get(manual_url)
        print(f"Status: {response.status_code}")
        print(f"Content: {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_daegu_bus_api()
