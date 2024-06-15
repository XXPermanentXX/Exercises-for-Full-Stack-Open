import {useEffect, useState} from "react";
import countriesService from "./services/countries.js";
import weatherService from "./services/weather.js";
import SearchResult from "./SearchResult.jsx";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [matchesCountries, setMatchesCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState();

  useEffect(() => {
    countriesService.getAll().then((data) => {
      setAllCountries(data);
    });
  }, []);

  useEffect(()=>{
    const matches=[];
    allCountries.filter((country) => {
      if (country.name.common.toLowerCase().includes(search.toLowerCase())) {
        matches.push(country);
      }
    });
    console.log(matches)
    if (matches.length === 1) getWeather(matches[0]);
    setMatchesCountries(matches);
  },[search])

  const getWeather = (country) => {
    weatherService.getWeather(country).then((data) => {
      console.log(data);
      setWeather(data);
    });
  }

  const handleSearch = (event) => {
    setSearch(event.target.value);
    if(event.target.value.length === 0) return;
    countriesService.getCountry(event.target.value).then((data) => {
      console.log(data);
    } );
  };

  return (
    <>
      <div>
        find countries <input value={search} onChange={handleSearch} />
      </div>
      <SearchResult countries={matchesCountries} search={search} setSearch={setSearch} weather={weather}/>
    </>
  );
}

export default App;
