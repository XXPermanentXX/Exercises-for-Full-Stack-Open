const API_KEY = import.meta.env.VITE_WEATHER_KEY;

const getWeather = (city) => {
    return fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`,
  )
    .then((response) => response.json())
    .then((data) => {
        const { lat, lon } = data[0];
      return fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${API_KEY}`,
      ).then((response) => response.json());
    });
};

export default { getWeather };
