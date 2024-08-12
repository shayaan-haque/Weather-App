require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY; 
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

    https.get(url, function (response) {
        response.on("data", function (data) {
            const newdata = JSON.parse(data);
            const weatherDescription = newdata.weather[0].description;
            const icon = newdata.weather[0].icon;
            const temp = newdata.main.temp;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png"; // Larger and more professional icon
            let bgColor = "#f0f0f0";

            if (weatherDescription.includes("rain")) {
                bgColor = "#a3c0e8"; // Light blue for rain
            } else if (weatherDescription.includes("cloud")) {
                bgColor = "#d3d3d3"; // Gray for clouds
            } else if (weatherDescription.includes("clear")) {
                bgColor = "#f7e98d"; // Yellow for clear skies
            } else if (weatherDescription.includes("snow")) {
                bgColor = "#e0f7fa"; // Light cyan for snow
            } else {
                bgColor = "#f5f5f5"; // Default light gray
            }

            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(`
                <body style="background-color: ${bgColor}; font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <div style="padding: 20px; background-color: rgba(255, 255, 255, 0.8); border-radius: 15px;">
                        <h1 style="font-size: 3em;">${query}</h1>
                        <h2 style="font-size: 2em;">${temp}°C</h2>
                        <p style="font-size: 1.5em;">${weatherDescription}</p>
                        <img src="${imageURL}" alt="Weather icon">
                    </div>
                </body>
            `);
            res.send();
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
