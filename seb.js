const https = require('https');

// Endpoint URL
const url = "https://consensus.bamboohr.com/timesheet/clock/entries";

// Headers
const headers = {
  "X-Csrf-token": "3391a848ad01f87470acb48030d1ff580b5731268eb56e7c89a8cfcc9716edbe03d15b44120accc7fe65db80624b42aff55e6a51c21168fc6dfd1b99d05eea02",
  "Cookie": "kndctr_63C70EF1613FCF530A495EE2_AdobeOrg_consent=general=out; kndctr_63C70EF1613FCF530A495EE2_AdobeOrg_identity=CiY2NTc2Nzg4MTY2MDQ3MDU4MTkxMTQwODE4NjM5NzY3NTc5MTU0N1ITCMPBxKqqMhABGAEqBElSTDEwAPABw8HEqqoy; AMCV_63C70EF1613FCF530A495EE2%40AdobeOrg=MCMID|65767881660470581911408186397675791547; lluid=2556; llcid=607186; bhr_features=eyJzdWJzY3JpYmVyIjp0cnVlLCJiaHJfdXNlciI6ZmFsc2UsInF1aWNrc3RhcnQiOmZhbHNlLCJpc19hZG1pbiI6ZmFsc2V9; trusted_browser=c93de8bd3b5451b1ad269aec0d6f995927c44de8f93229a0f4897051fc03b631; acceptCookies=siteWideCookieAccepted; TAsessionID=03c24083-76bf-425a-b676-2a1db2cfbb3f|NEW; notice_behavior=expressed|eu; notice_preferences=0:; notice_gdpr_prefs=0:; TAconsentID=f579fa0b-4079-40d7-852f-d7eabc0dfd88; cmapi_gtm_bl=ga-ms-ua-ta-asp-bzi-sp-awct-cts-csm-img-flc-fls-mpm-mpr-m6d-tc-tdc; cmapi_cookie_privacy=permit_1_required; _cfuvid=OiybYQdTN8wF1cJNS9HNSJxKqET719433yRq4NxDKWE-1730379117265-0.0.1.1-604800000; PHPSESSID=vMlB9JnR5eAh8mQbNy-YJfZcIT8wfZEa; llfn=Tern; lluidh=b51d2fd94ef3b26cb787a9edf41a9a3acef3622ed3e6f840d0f8da14ab511878; lluidt=1732974826; _dd_s=rum=0&expire=1730380193101",
  "Content-Type": "application/json"
};

// Define start and end times
const startTime = "08:30";
const endTime = "16:00";

// Employee and tracking IDs
const employeeId = 174;
const trackingId = 1;

// Function to format date to "YYYY-MM-DD"
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Function to send POST request using https
const sendPostRequest = (payload, dateStr) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const options = {
      method: "POST",
      headers: {
        ...headers,
        "Content-Length": data.length
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        console.log(`Date: ${dateStr} - Status Code: ${res.statusCode}`);
        try {
          const jsonResponse = JSON.parse(responseData);
          console.log("Response JSON:", jsonResponse);
        } catch (error) {
          console.log("Response content is not JSON");
        }
        resolve();
      });
    });

    req.on("error", (error) => {
      console.error(`Error on ${dateStr}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

// Function to iterate through each day in October 2024
const createTimeEntries = async () => {
  let currentDate = new Date(2024, 9, 7); // October 1, 2024
  const endDate = new Date(2024, 9, 14);   // October 31, 2024

  while (currentDate <= endDate) {
    // Check if the current day is a weekday
    if (currentDate.getDay() >= 2 && currentDate.getDay() <= 6) { // 2=Monday, ..., 6=Friday
      const dateStr = formatDate(currentDate);
      console.log(currentDate)
      console.log(currentDate.getDay())
      console.log(dateStr)


      // Payload with 'entries' array
      const payload = {
        entries: [
          {
            date: dateStr,
            employeeId: employeeId,
            end: endTime,
            id: null,
            note: "",
            projectId: null,
            start: startTime,
            taskId: null,
            trackingId: trackingId
          }
        ]
      };

      try {
        await sendPostRequest(payload, dateStr);
      } catch (error) {
        console.error("Request failed:", error);
      }
    }
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
};

createTimeEntries();
