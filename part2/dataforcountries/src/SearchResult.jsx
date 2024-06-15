import DetailResult from "./DetailResult.jsx";

const SearchResult = ({ countries, search,setSearch,weather }) => {
  if (!search) return null;
  if (countries.length > 10)
    return <div>Too many matches, specify another filter</div>;
  else if (countries.length > 1) {
    return (
      <>
        {countries.map((country) => {
          return (
            <div>
              <span key={country.name.common}>{country.name.common}  </span>
              <button onClick={() => setSearch(country.name.common)}>
                show
              </button>
            </div>
          );
        })}
      </>
    );
  } else if (countries.length === 1&&weather) {
    return <DetailResult country={countries[0]} weather={weather}/>;
  }
};

export default SearchResult;
