const cityInput = document.querySelector("#cityinput");
const searchButton = document.querySelector("#searchButton");
const historyList = document.querySelector("#historylist");
const searchForm = document.querySelector("#searchForm");
const apiKey = '3b97f7991ba5c5e11293e7dcf2d6c11f';

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
.then(function(response) {
    return response.json();
})
.then(function(data) {
    const currentCityElement = document.getElementById("currentCity");
    const currentTemperatureElement = document.getElementById("currentTemperature");
    const currentDescriptionElement = document.getElementById("currentDescription");

    currentCityElement.textContent = `City: ${data.name}`;
    currentTemperatureElement.textContent = `Temperature: ${data.main.temp}°F`;
    currentDescriptionElement.textContent = `Description: ${data.weather[0].description}`;
})

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {  
        console.log(data);     
        const forecastContainer = document.querySelector(".futurecast");
        forecastContainer.innerHTML = "";

        for (let i = 7; i < data.list.length; i += 8) {
            const forecastItem = data.list[i];
            const forecastDate = new Date(forecastItem.dt * 1000);

            const forecastElement = document.createElement("div");
            forecastElement.classList.add("forecast-item");
            forecastElement.innerHTML = `
                <p>Date: ${forecastDate.toDateString()}</p>
                <p>Temperature: ${forecastItem.main.temp}°F</p>
                <p>Description: ${forecastItem.weather[0].description}</p>
            `;

            forecastContainer.appendChild(forecastElement);
        }
    })
    .catch(function(error) {
        console.error("Error fetching data: " + error);
    });

});