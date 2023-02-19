import { useEffect, useState } from 'react'
import countryService from './services/countries'
import './index.css'

const CountrySearch = ({onChange}) => {
  return (
    <div>
      Find countries <input onChange={onChange} />
    </div>
  )
}

const CountryDisplay = ({country}) => {
  return (
    <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area} </p>
        <b>languages:</b>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}

        <img src={country.flags.png}/>
      </div>
  )
}

const FetchWeather = ({country}) => {
  const [weather, setWeather] = useState([])

  useEffect(() => {
    const latitude = country.capitalInfo.latlng[0]
    const longitude = country.capitalInfo.latlng[1]
    const API_KEY = process.env.REACT_APP_API_KEY

    countryService.getCountryWeather(latitude, longitude, API_KEY)
                  .then(data => {setWeather(data)})
  }, [])

  return weather
}

const WeatherDisplay = ({country}) => {
  const weather = FetchWeather(country={country})
  if (weather.length != 0) {
    return (
      <div>
        <h1>Weather in {country.country.capital}</h1>
        <p>Temperature {weather.main.temp} °C, feels like {weather.main.feels_like} °C, minimum temperature {weather.main.temp_min}</p>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
        <p>Wind {weather.wind.speed} m/s</p>
      </div>
    )
  }
}
const CountryListElement = ({country, setSearchText}) => {
  return (
    <li key={country.name.common}> {country.name.common} {<button onClick={() => {setSearchText(country.name.common)}}>show</button>}</li>
  )
}

const CountryList = ({searchText, countries, setSearchText}) => {
  if (searchText === '') {
    return (
      <div>Please specify search to see a listing of countries.</div>
    )
  }
  let filteredCountries = countries.filter(country => country.name.common.toLowerCase()
                             .includes(searchText.toLowerCase()))
  if (filteredCountries.length > 10) {
    return (
      <div>Too many countries, please specify search.</div>
    )
  }                     
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    return (
      <div>
        <CountryDisplay country={country} />
        <WeatherDisplay country={country} />
      </div>
    )
  }                         
  return (
    <div>
      {filteredCountries.map(country => <CountryListElement key={country.name.common} country={country} setSearchText={setSearchText}/>
                )}
    </div>
  )
}
const App = () => {
  const [searchText, setSearchText] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getAllCountries()
                  .then(data => {
                    setCountries(data)
                  })
  }, [])

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value)
  }

  return (
    <div>
      <CountrySearch onChange={handleSearchTextChange} />
      <CountryList searchText={searchText} countries={countries} setSearchText={setSearchText} />
    </div>
  )

}

export default App