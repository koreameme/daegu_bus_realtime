import requests
import json

# User provided API key
SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"

def test_daegu_bus_api():
    # Base URL for Daegu Bus Information System (BIS)
    # Based on general public data portal standards for Daegu
    base_url = "http://apis.data.go.kr/6270000/dgbusinfo/getBusArrivalList"
    
    # Daegu station ID example: 7011010100 (Daegu Station)
    # The actual parameter names can vary, let's try the common ones for Daegu
    params = {
        'serviceKey': SERVICE_KEY,
        'stopNo': '7011010100', # Possible parameter name for Daegu
        'type': 'json'
    }

    print(f"Testing URL: {base_url}")
    print(f"With params: {params}")

    try:
        # Note: serviceKey often needs to be unquoted or handled specially in some APIs
        response = requests.get(base_url, params=params)
        print(f"Status Code: {response.status_code}")
        
        try:
            data = response.json()
            print("Response Data (JSON):")
            print(json.dumps(data, indent=2, ensure_ascii=False))
        except:
            print("Response Content (Not JSON):")
            print(response.text[:500]) # Print first 500 chars

    except Exception as e:
        print(f"Error calling API: {e}")

if __name__ == "__main__":
    test_daegu_bus_api()
    
    # Also trying the 'Tago' (National) endpoint as a backup with Daegu city code
    print("\n--- Testing Tago (National) Endpoint ---")
    tago_url = "http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPreList"
    tago_params = {
        'serviceKey': SERVICE_KEY,
        'cityCode': '22', # Daegu
        'nodeId': 'DGB7011010100',
        'numOfRows': '10',
        'pageNo': '1',
        '_type': 'json'
    }
    try:
        resp = requests.get(tago_url, params=tago_params)
        print(f"Tago Status: {resp.status_code}")
        print(resp.text[:500])
    except Exception as e:
        print(f"Tago Error: {e}")
