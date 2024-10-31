import requests
from datetime import datetime, timedelta

# Endpoint URL
url = "https://consensus.bamboohr.com/timesheet/clock/entries"



# Headers
headers = {
    "X-Csrf-token": "3391a848ad01f87470acb48030d1ff580b5731268eb56e7c89a8cfcc9716edbe03d15b44120accc7fe65db80624b42aff55e6a51c21168fc6dfd1b99d05eea02",
    "Cookie": "kndctr_63C70EF1613FCF530A495EE2_AdobeOrg_consent=general=out; kndctr_63C70EF1613FCF530A495EE2_AdobeOrg_identity=CiY2NTc2Nzg4MTY2MDQ3MDU4MTkxMTQwODE4NjM5NzY3NTc5MTU0N1ITCMPBxKqqMhABGAEqBElSTDEwAPABw8HEqqoy; AMCV_63C70EF1613FCF530A495EE2%40AdobeOrg=MCMID|65767881660470581911408186397675791547; lluid=2556; llcid=607186; bhr_features=eyJzdWJzY3JpYmVyIjp0cnVlLCJiaHJfdXNlciI6ZmFsc2UsInF1aWNrc3RhcnQiOmZhbHNlLCJpc19hZG1pbiI6ZmFsc2V9; trusted_browser=c93de8bd3b5451b1ad269aec0d6f995927c44de8f93229a0f4897051fc03b631; acceptCookies=siteWideCookieAccepted; TAsessionID=03c24083-76bf-425a-b676-2a1db2cfbb3f|NEW; notice_behavior=expressed|eu; notice_preferences=0:; notice_gdpr_prefs=0:; TAconsentID=f579fa0b-4079-40d7-852f-d7eabc0dfd88; cmapi_gtm_bl=ga-ms-ua-ta-asp-bzi-sp-awct-cts-csm-img-flc-fls-mpm-mpr-m6d-tc-tdc; cmapi_cookie_privacy=permit_1_required; _cfuvid=OiybYQdTN8wF1cJNS9HNSJxKqET719433yRq4NxDKWE-1730379117265-0.0.1.1-604800000; PHPSESSID=vMlB9JnR5eAh8mQbNy-YJfZcIT8wfZEa; llfn=Tern; lluidh=b51d2fd94ef3b26cb787a9edf41a9a3acef3622ed3e6f840d0f8da14ab511878; lluidt=1732974826; _dd_s=rum=0&expire=1730380193101",
    "Content-Type": "application/json"
}

# Define start and end time
start_time = "08:30"
end_time = "16:00"

# Employee and tracking IDs
employee_id = 174
tracking_id = 1

# Loop through each day in October 2024
current_date = datetime(2024, 10, 1)
end_date = datetime(2024, 10, 31)



while current_date <= end_date:
    # Only proceed if it's a weekday (0=Monday, ..., 4=Friday)
    if current_date.weekday() < 5:
        # Format date as a string
        date_str = current_date.strftime("%Y-%m-%d")
        
        # Payload with 'entries' array
        payload = {
            "entries": [
                {
                    "date": date_str,
                    "employeeId": employee_id,
                    "end": end_time,
                    "id": None,
                    "note": "",
                    "projectId": None,
                    "start": start_time,
                    "taskId": None,
                    "trackingId": tracking_id
                }
            ]
        }

        # Send POST request
        response = requests.post(url, json=payload, headers=headers)

        # Print response
        print(f"Date: {date_str} - Status Code:", response.status_code)
        
        # Check if response has JSON content
        try:
            print("Response JSON:", response.json())
        except requests.exceptions.JSONDecodeError:
            print("Response content is not JSON")

    # Move to the next day
    current_date += timedelta(days=1)