const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api/";

const getAll = () => {
  return fetch(BASE_URL + "all").then((response) => response.json());
};

const getCountry = (name) => {
  return fetch(BASE_URL + "name/" + name)
    .then((response) => {
      if (!response.ok) {
          return [];
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching country data:", error);
    });
};

export default { getAll, getCountry };
