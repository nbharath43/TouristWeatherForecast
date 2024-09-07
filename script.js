const apiKey = 'e7e55771f9b815c9b8fa9f38416b55a4';  // Your API key from OpenWeatherMap

const cityName = document.getElementById("cityName");
const submit = document.getElementById("submit");
const temp = document.getElementById("temp");
const temp2 = document.getElementById("temp2");
const feels_like = document.getElementById("feels_like");
const humidity = document.getElementById("humidity");
const humidity2 = document.getElementById("humidity2");
const min_temp = document.getElementById("min_temp");
const max_temp = document.getElementById("max_temp");
const wind_speed = document.getElementById("wind_speed");
const wind_speed2 = document.getElementById("wind_speed2");
const wind_degrees = document.getElementById("wind_degrees");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const travelStatus = document.getElementById("travelStatus");

const getWeather = (city) => {
  cityName.innerHTML = city;

  // Fetch current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(weatherData => {
      console.log(weatherData);

      // Display current weather data in HTML
      temp.innerHTML = weatherData.main.temp;
      temp2.innerHTML = weatherData.main.temp;
      feels_like.innerHTML = weatherData.main.feels_like;
      humidity.innerHTML = weatherData.main.humidity;
      humidity2.innerHTML = weatherData.main.humidity;
      min_temp.innerHTML = weatherData.main.temp_min;
      max_temp.innerHTML = weatherData.main.temp_max;
      wind_speed.innerHTML = weatherData.wind.speed;
      wind_speed2.innerHTML = weatherData.wind.speed;
      wind_degrees.innerHTML = weatherData.wind.deg;

      // Convert Unix timestamps to human-readable time
      sunrise.innerHTML = formatUnixTimestamp(weatherData.sys.sunrise);
      sunset.innerHTML = formatUnixTimestamp(weatherData.sys.sunset);

      // Check travel conditions for today
      checkTravelConditions(weatherData, city);
    })
    .catch(err => {
      console.error(err);
      alert("Error fetching weather data. Please try again.");
    });
};

submit.addEventListener("click", (e) => {
  e.preventDefault();
  const city = document.getElementById("city").value;
  if (city) {
    getWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

// Function to format Unix timestamp as human-readable time
function formatUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Function to check travel conditions for today
function checkTravelConditions(weatherData, city) {
  const temp = weatherData.main.temp;
  const wind_speed = weatherData.wind.speed;
  const humidity = weatherData.main.humidity;

  // Define travel conditions
  const temperatureMin = 10; // Minimum temperature threshold for good weather
  const temperatureMax = 30; // Maximum temperature threshold for good weather
  const maxWindSpeed = 15; // Maximum wind speed for good weather
  const maxHumidity = 50; // Maximum humidity for good weather

  if (temp >= temperatureMin && temp <= temperatureMax && wind_speed <= maxWindSpeed && humidity < maxHumidity) {
    travelStatus.innerHTML = "Good weather for travel today!";
  } else {
    travelStatus.innerHTML = "Travel conditions may not be ideal today. Checking for future good weather...";

    // If today is not suitable for travel, check forecast
    checkFutureWeather(city);
  }
}

// Function to check future weather conditions
function checkFutureWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(forecastData => {
      console.log(forecastData);

      // Loop through the forecast data to find a suitable day
      const forecastList = forecastData.list;
      let bestDate = null;

      for (let i = 0; i < forecastList.length; i++) {
        const weather = forecastList[i].main;
        const wind = forecastList[i].wind;

        // Check for conditions between 10°C - 30°C temperature, wind speed <= 15, and humidity < 50
        if (weather.temp >= 10 && weather.temp <= 30 && wind.speed <= 15 && weather.humidity < 50) {
          bestDate = new Date(forecastList[i].dt * 1000);
          break;  // Stop at the first suitable day
        }
      }

      if (bestDate) {
        travelStatus.innerHTML = `Good weather for travel expected on ${bestDate.toDateString()} (${bestDate.toLocaleDateString()}).`;
      } else {
        travelStatus.innerHTML = "No good travel weather found in the forecast.";
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error fetching forecast data. Please try again.");
    });
}
