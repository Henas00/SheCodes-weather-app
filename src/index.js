const axios = require("axios").default;
function formatDate(DOOL) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return `${days[DOOL.getDay()]} ${DOOL.getDate()} ${month[DOOL.getMonth()]}`;
}
//show date
const today = formatDate(new Date());
const date = document.getElementById("date");
date.textContent = today;
let apiKey = "7cb230c11cc7bb7b904f70eb8d9739c7";

const btn = document.querySelector(".btn");
const temp = document.querySelector("#currentTemp");
const radios = document.querySelectorAll('input[name="temp"]');
const input = document.querySelector("#search-input");
const showCity = document.querySelector("#city");

navigator.geolocation.getCurrentPosition(getWeather);
function getWeather(position) {
  const lat = position.coords.latitude.toFixed(2);
  const lon = position.coords.longitude.toFixed(2);
  const url = "https://api.openweathermap.org/data/2.5/weather";
  const params = {
    lat: lat,
    lon: lon,
    units: "metric",
    appid: apiKey
  };
  axios
    .get(url, {
      params: params
    })
    .then((response) => {
      temp.textContent = Math.round(response.data.main.temp);
      const city = response.data.name;
      showCity.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    });
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = input.value;
  showCity.textContent = city.charAt(0).toUpperCase() + city.slice(1);
  let url = `https://api.openweathermap.org/data/2.5/weather`;
  const params = {
    q: input.value,
    units: "metric",
    appid: apiKey
  };

  axios
    .get(url, {
      params: params
    })
    .then((response) => {
      temp.textContent = Math.round(response.data.main.temp);
    });

  // city.textContent = input;
});

for (let radio of radios) {
  radio.addEventListener("change", () => {
    let tempValue = temp.textContent;
    if (radio.value === "fahrenheit") {
      tempValue = (tempValue * 9) / 5 + 32;
      temp.innerHTML = Math.round(tempValue);
    } else {
      tempValue = ((tempValue - 32) * 5) / 9;
      temp.innerHTML = Math.round(tempValue);
    }
  });
}
