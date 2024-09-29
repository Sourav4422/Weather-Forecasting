document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});

// API Key and Base URL
const apiKey = '2f0db845776d8282fb66f8526918fe9e';  // Replace with your actual OpenWeather API Key
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

function getWeatherData(city) {
    fetch(`${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            getForecastData(city);
        })
        .catch(err => console.error('Error fetching weather data: ', err));
}

function getForecastData(city) {
    fetch(`${apiUrl}forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const forecastData = processForecastData(data);
            displayForecastChart(forecastData);
        })
        .catch(err => console.error('Error fetching forecast data: ', err));
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <p><strong>Date:</strong> ${new Date(data.dt * 1000).toLocaleString()}</p>
    `;
}

function processForecastData(data) {
    const dailyData = [];
    for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        dailyData.push({
            temp: dayData.main.temp,
            humidity: dayData.main.humidity,
            weather: dayData.weather[0].main,
            date: new Date(dayData.dt * 1000).toLocaleDateString()
        });
    }
    return dailyData;
}

function displayForecastChart(forecastData) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    const labels = forecastData.map(day => day.date);
    const temps = forecastData.map(day => day.temp);
    const humidity = forecastData.map(day => day.humidity);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                },
                {
                    label: 'Humidity (%)',
                    data: humidity,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Default City
getWeatherData('Delhi');
