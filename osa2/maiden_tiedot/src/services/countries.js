import axios from 'axios'
const baseURL = 'https://restcountries.com/v3.1/all'

const getAllCountries = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}
const getCountryWeather = (latitude, longitude, API_KEY) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    return request.then(response => response.data)
}


export default { getAllCountries, getCountryWeather }