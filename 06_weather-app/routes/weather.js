const express = require('express');
const axios = require('axios');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.render('index', { 
    weather: null, 
    error: null,
    city: '' 
  });
});

// Weather route
router.post('/weather', async (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city) {
    return res.render('index', { 
      weather: null, 
      error: 'Please enter a city name',
      city: '' 
    });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    const weatherData = response.data;

    const weather = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      pressure: weatherData.main.pressure,
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    res.render('index', { 
      weather, 
      error: null,
      city: city 
    });

  } catch (error) {
    let errorMessage = 'City not found. Please try again.';
    
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'City not found. Please check the spelling.';
      } else if (error.response.status === 401) {
        errorMessage = 'Invalid API key. Please check your configuration.';
      }
    }

    res.render('index', { 
      weather: null, 
      error: errorMessage,
      city: city 
    });
  }
});

module.exports = router;