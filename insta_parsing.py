import requests
import json
import copy

def parseInstaLink(link: str):
    url = "https://api.brightdata.com/datasets/v3/trigger"
    headers = {
        "Authorization": "Bearer 90d5132346385f15f61553ea2c06b02d17479b60514f301ad79aef4d2afa903a",
        "Content-Type": "application/json",
    }
    params = {
        "dataset_id": "gd_lk5ns7kz21pck8jpis",
        "include_errors": "true",
    }

    data = [{"url": link}]
    response = requests.post(url, headers=headers, params=params, json=data)
    
    if response.status_code != 200:
        print("Error")
    else:
        try:
            response_data = response.json()
            # print(response_data)
            returnInstaInfo(response_data)
        except json.JSONDecodeError:
            print("Failed to decode JSON response")

import time
def returnInstaInfo(response_data):
    snapshot = response_data['snapshot_id']
    url = f"https://api.brightdata.com/datasets/v3/snapshot/{snapshot}"
    print(url)
    headers = {
        "Authorization": "Bearer 90d5132346385f15f61553ea2c06b02d17479b60514f301ad79aef4d2afa903a",
    }
    params = {
        "format": "json",
    }

    response = requests.get(url, headers=headers)
    print(response.json())
    response2 = requests.get(url, headers=headers, params=params)
    # print(response2.json())
    # testing code
    user_posted = response2.json()[0]['user_posted']
    print(user_posted)
    # photos = response.json()[0]['photos']
    # print(photos)
    return response2

parseInstaLink("https://www.instagram.com/p/DHXSZxMvV0W/")