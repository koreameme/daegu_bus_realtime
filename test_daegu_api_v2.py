import requests
import json
import xml.etree.ElementTree as ET

# User provided API key
SERVICE_KEY = "aac18bb3e975832f34707abcdc088134737efa3ae67f039ba6b842fc0f7ecdd6"

def test_daegu_bus_api():
    # Correct Endpoint based on typical Daegu service
    url = "http://apis.data.go.kr/6270000/dgBusArriveService/getBusArriveInfoList"
    
    # Daegu Station (대구역건너) ID might be '00192' or similar
    # Parameters for Daegu: serviceKey, pageNo, numOfRows, stopId
    params = {
        'serviceKey': SERVICE_KEY,
        'pageNo': '1',
        'numOfRows': '10',
        'stopId': '00192' # Example stopId for Daegu Station
    }

    print(f"Testing URL: {url}")
    print(f"With params: {params}")

    try:
        response = requests.get(url, params=params)
        print(f"Status Code: {response.status_code}")
        
        # Check if output is XML or JSON
        content = response.text
        print("Response Content (First 500 chars):")
        print(content[:500])

        if "<response>" in content:
            # Try parsing XML
            root = ET.fromstring(response.content)
            header = root.find('.//header')
            if header is not None:
                res_code = header.find('resultCode').text
                res_msg = header.find('resultMsg').text
                print(f"Result: {res_code} - {res_msg}")
            
            items = root.findall('.//item')
            print(f"Found {len(items)} items.")
            for item in items:
                # Daegu specific fields: routeNo, arrTime, etc.
                # Adjust based on observed XML structure
                try:
                    r_no = item.find('routeNo').text
                    a_time = item.find('arrTime').text
                    print(f"Route {r_no}: {a_time}")
                except:
                    pass

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_daegu_bus_api()
