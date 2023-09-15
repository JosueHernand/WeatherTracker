const cityInput = document.querySelector("#cityinput");
const searchButton = document.querySelector("#searchButton");
const historyList = document.querySelector("#historylist");
const searchForm = document.querySelector("#searchForm");
const apiKey = '3b97f7991ba5c5e11293e7dcf2d6c11f';

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();

    if(cityName) {
        const listItem = document.createElement("li");
        listItem.textContent = cityName;
        historyList.appendChild(listItem);
        cityInput.value = "";

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
    }
});

// searchButton.addEventListener("submit", searchCity);