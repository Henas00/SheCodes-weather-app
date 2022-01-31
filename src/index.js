function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function formatDate(DOOL) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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
    "Dec",
  ];
  return `${days[DOOL.getDay()]} ${DOOL.getDate()} ${month[DOOL.getMonth()]}`;
}

//show date
const today = formatDate(new Date());
const date = document.getElementById("date");
date.textContent = today;

let apiKey = "7cb230c11cc7bb7b904f70eb8d9739c7";

const btn = document.querySelector(".butt");
const temp = document.querySelector("#currentTemp");
const radios = document.querySelectorAll('input[name="temp"]');
const celsius = document.querySelector("#celsius");
const input = document.querySelector(".search-input");
const showCity = document.querySelector("#city");
const img = document.querySelector(".icon");
const condition = document.querySelector("#condition");
const icon = document.querySelector(".icon");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind");
const forecast = document.querySelector("#forecast");
//url
const urlCurrentWeather = "https://api.openweathermap.org/data/2.5/weather";
const urlForecast = "https://api.openweathermap.org/data/2.5/onecall";



getForecast(coords = { lat: 40.71, lon: 74.0 });

navigator.geolocation.getCurrentPosition(getWeather);
let coord;
function getData(url, params) {
  celsius.checked = true;
  axios
    .get(url, {
      params,
    })
    .then((response) => {
      const { main, name, weather, wind, coord } = response.data;
      
      temp.textContent = Math.round(main.temp);
      humidity.textContent = main.humidity;
      windSpeed.textContent = wind.speed;
      showCity.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      condition.textContent = weather[0].description;
      icon.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
      );
      icon.setAttribute("alt", weather[0].description);
      getForecast(coord);
    });
}

getData(
  urlCurrentWeather,
  (params = {
    q: "new york",
    units: "metric",
    appid: apiKey,
  })
);

function getForecast(coords) {
  const params = {
    lat: coords.lat,
    lon: coords.lon,
    units: "metric",
    appid: apiKey,
    exclude: encodeURI(["minutely", "hourly", "alerts"]),
  };
  axios
    .get(urlForecast, {
      params,
    })
    .then((res) => displayForcast(res));
}

function displayForcast(res) {
  let forecastHTML = "";
  if (res) {
    console.log(res)
    const dailyForecast = res.data.daily.slice(1, 7);
    for (let day of dailyForecast) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="forecast-date">${formatDay(day.dt)}</div>
        <img width="48" src="http://openweathermap.org/img/wn/${
          day.weather[0].icon
        }@2x.png" alt="">
        <div><span id="max">${Math.round(
          day.temp.max
        )}°</span><span id="min">${Math.round(day.temp.min)}°</span></div>
      </div>
      `;
    }
  }
  forecast.innerHTML = forecastHTML;
}

function getWeather(position) {
  const lat = position.coords.latitude.toFixed(2);
  const lon = position.coords.longitude.toFixed(2);
  const params = {
    lat: lat,
    lon: lon,
    units: "metric",
    appid: apiKey,
  };
  getData(urlCurrentWeather, params);
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = input.value;
  showCity.textContent = city.charAt(0).toUpperCase() + city.slice(1);
  const params = {
    q: input.value,
    units: "metric",
    appid: apiKey,
  };

  getData(urlCurrentWeather, params);
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
