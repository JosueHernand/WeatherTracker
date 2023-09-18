const cityInput = document.querySelector("#cityinput");
const searchButton = document.querySelector("#searchButton");
const historyList = document.querySelector("#historylist");
const searchForm = document.querySelector("#searchForm");
const apiKey = '3b97f7991ba5c5e11293e7dcf2d6c11f';
const forecastContainer = document.getElementById("forecastContainer");

function getWeatherIcon(iconCode) {
    switch (iconCode) {
        case "01d":
            return '<i class="fas fa-sun"></i>';
        case "01n":
            return '<i class="fas fa-moon"></i>';
        case "02d":
            return '<i class="fas fa-cloud-sun"></i>';
        case "02n":
            return '<i class="fas fa-cloud-moon"></i>';
        case "03d":
        case "03n":
        case "04d":
        case "04n":
            return '<i class="fas fa-cloud"></i>';
        case "09d":
        case "09n":
        case "10d":
        case "10n":
            return '<i class="fas fa-cloud-showers-heavy"></i>';
        case "11d":
        case "11n":
            return '<i class="fas fa-bolt"></i>';
        case "13d":
        case "13n":
            return '<i class="fas fa-snowflake"></i>';
        case "50d":
        case "50n":
            return '<i class="fas fa-smog"></i>';
        default:
            return '<i class="fas fa-question"></i>';
    }
}

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        const CityEl = document.getElementById("currentCity");
        const Temperature = document.getElementById("currentTemperature");
        const Wind = document.getElementById("windSpeed");
        const Humidity = document.getElementById("currentHumidity");

        const iconCode = data.weather[0].icon;
        const weatherIconHTML = getWeatherIcon(iconCode);

        const currentDate = new Date();
        const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        
        const windSpeedMPS = data.wind.speed;
        const windSpeedMPH = windSpeedMPS * 2.23694;

        Temperature.textContent = `Temperature: ${data.main.temp}°F`;
        Wind.textContent = `Wind: ${windSpeedMPH.toFixed(2)} MPH`;
        Humidity.textContent = `Humidity: ${data.main.humidity}%`;

        CityEl.innerHTML = `<span style="font-size: 24px; font-weight: bold; position: relative; top: -16px;;">${data.name} (${formattedDate})${weatherIconHTML}</span>`;
    })

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {  
        console.log(data);     
        const forecastContainer = document.getElementById("forecastContainer");
        forecastContainer.innerHTML = "";

        for (let i = 7; i < data.list.length; i += 8) {
            const forecastItem = data.list[i];
            const forecastDate = new Date(forecastItem.dt * 1000);

            const formattedDate = forecastDate.toLocaleDateString('en-US');
            const windSpeedMPS = forecastItem.wind.speed;
            const windSpeedMPH = windSpeedMPS * 2.23694;
            const humidity = forecastItem.main.humidity;
            const weatherIcon = getWeatherIcon(forecastItem.weather[0].icon);

            const forecastBox = document.createElement("div");
            forecastBox.classList.add("forecast-box");
            forecastBox.innerHTML = `
                <p>${formattedDate} </p>
                <p>${weatherIcon}</p>
                <p>Temp: ${forecastItem.main.temp}°F</p>
                <p>Wind: ${windSpeedMPH.toFixed(2)} MPH</p>
                <p>Humidity: ${humidity}%<p>
            `;
            forecastContainer.appendChild(forecastBox);
        }
    })
    .catch(function(error) {
        console.error("Error fetching data: " + error);
    });
});

let searchHistory = [];

function updateSearchHistory() {
    historyList.innerHTML = "";
    for (const searchEntry of searchHistory) {
        const historyBox = document.createElement("div");
        historyBox.classList.add("history-box");
        historyBox.textContent = searchEntry;
        historyBox.addEventListener('click', function() {
            cityInput.value = searchEntry;
            searchButton.click();
        });
        historyList.appendChild(historyBox);
    }
}

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    searchHistory.unshift(cityName);
    if (searchHistory.length > 8) {
        searchHistory.pop();
    }
    updateSearchHistory();
});