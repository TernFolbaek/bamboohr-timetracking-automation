const https = require('https');

// Endpoint URL
const url = "https://consensus.bamboohr.com/timesheet/clock/entries";

// Headers
const headers = {
  "X-Csrf-token": process.env.X-Csfr-token,
  "Cookie": process.env.Cookie,
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
