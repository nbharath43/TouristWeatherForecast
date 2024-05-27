const options = {
  method: 'GET',
  headers: {
      'X-RapidAPI-Key': '7da4e11b23mshfe8548d7346bbfap11116ajsn8224258fec64',
      'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
  }
};

const cityName = document.getElementById("cityName");

const getWeather = (city) => {
  cityName.innerHTML = city;

  fetch('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=' + city, options)
      .then(response => response.json())
      .then(weatherData => {
          console.log(weatherData);

          // Display weather data in HTML
          temp.innerHTML = weatherData.temp;
          temp2.innerHTML = weatherData.temp;
          feels_like.innerHTML = weatherData.feels_like;
          humidity.innerHTML = weatherData.humidity;
          humidity2.innerHTML = weatherData.humidity;
          min_temp.innerHTML = weatherData.min_temp;
          max_temp.innerHTML = weatherData.max_temp;
          wind_speed.innerHTML = weatherData.wind_speed;
          wind_speed2.innerHTML = weatherData.wind_speed;
          wind_degrees.innerHTML = weatherData.wind_degrees;

          // Convert Unix timestamps to human-readable time
          sunrise.innerHTML = formatUnixTimestamp(weatherData.sunrise);
          sunset.innerHTML = formatUnixTimestamp(weatherData.sunset);

          // Call travel conditions check with weather data
          checkTravelConditions(weatherData);
      })
      .catch(err => {
          console.error(err);
          // Handle errors here, e.g., display an error message to the user
      });
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  getWeather(city.value);
});

// Example function to format Unix timestamp as "HH:mm" time
function formatUnixTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}


// Example function to check travel conditions and recommend a future travel time
function checkTravelConditions(weatherData) {
  // Define your criteria here (e.g., temperature, precipitation)
  const temperatureThreshold = 20; // Example: Travel if temperature is above 20°C
  const maxPrecipitation = 0.1;   // Example: Travel if precipitation is less than 0.1 mm

  // Extract relevant weather data from the API response
  const temperature = weatherData.temp;
  const precipitation = weatherData.precipitation || 0; // Use precipitation data if available, else default to 0

  // Check conditions
  const travelStatus = document.getElementById("travelStatus");
  if (temperature >= temperatureThreshold && precipitation <= maxPrecipitation) {
    travelStatus.textContent = "You can travel!";
  } else {
    // Calculate and display a future travel recommendation
    const futureTravelDate = calculateFutureTravelDate(weatherData);
    travelStatus.innerHTML = `Travel is not advisable. <br> Consider traveling on ${futureTravelDate}.`;
  }
}

// Function to calculate a future travel date based on weather conditions
function calculateFutureTravelDate(weatherData) {
  // Implement logic to calculate a future travel date based on weather conditions.
  // This can be based on historical weather data or forecasted conditions.
  // For simplicity, this example suggests traveling in 3 days.
  
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 3); // Travel in 3 days

  // Format the date as a string (e.g., "Monday, September 25, 2023")
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return futureDate.toLocaleDateString(undefined, options);
}

