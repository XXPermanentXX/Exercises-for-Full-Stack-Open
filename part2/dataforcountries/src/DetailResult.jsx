
const DetailResult = ({ country, weather }) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={country.name.common}
        height="150"
      ></img>
      <h3>Weather in {country.capital[0]}</h3>
      <div>temperature {weather.current.temp} Celcius</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
        alt={weather.current.weather[0].description}
      ></img>
      <div>wind {weather.current.wind_speed} m/s</div>
    </>
  );
};

export default DetailResult;
