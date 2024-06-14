const BASE_URL='https://studies.cs.helsinki.fi/restcountries/api/'

const getAll = () => {
    return fetch(BASE_URL+'all').then(response=>response.json())
}

const getCountry = (name) => {
    return fetch(BASE_URL+'name/'+name).then(response=>response.json())
}

export default { getAll, getCountry }