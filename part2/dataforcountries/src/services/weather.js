const API_KEY = import.meta.env.VITE_WEATHER_KEY;

const getWeather = (country) => {
    const lat = country.capitalInfo.latlng[0];
    const lon = country.capitalInfo.latlng[1];
    return fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${API_KEY}`,
      ).then((response) => response.json());
};

export default { getWeather };
