import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

const CityBlock = ({ data, time, date }) => {
  if (data === null) {
    return (
      <div id="city-info">
        Weather and timezone data not found. Try again later.
      </div>
    )
  }

  let temperatureC = (data.main.temp - 273.15).toFixed(2);
  let temperatureF = ((temperatureC * 1.6) + 32).toFixed(2);
  let weather = data.weather[0].description;
  let windSpeed = data.wind.speed;
  let windDirection = data.wind.deg;
  let iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <div id="city-info">
      <div id="city-time">{time}</div>
      <div id="city-date">{date}</div>
      <ul>
        <li>{temperatureC}°C / {temperatureF}°F</li>
        <img src={iconUrl} id="icon" alt="weatherIcon"></img><li>{weather}</li>
        {windSpeed > 0 && <li>Wind is blowing at {windSpeed}m/s at {windDirection}°</li>}
      </ul>
    </div>
  )
}

const CityInfo = ({ city }) => {
  const [weatherData, setWeatherData] = useState(undefined);
  const [utcOffset, setUtcOffset] = useState(undefined);
  const [localTime, setLocalTime] = useState(undefined);
  const [localDate, setLocalDate] = useState(undefined);
  const [background, setBackground] = useState(undefined);
  const [bgContextLink, setBgContextLink] = useState(undefined);
  const [cityName, setCityName] = useState(undefined);
  const timeInterval = useRef(undefined);

  function calculateLocalTime(offset) {
    if (offset === null) return null;

    let date = new Date();
    let currentTime = date.getTime();
    let localOffset = date.getTimezoneOffset() * 60000;
    let utc = currentTime + localOffset;
    let newDate = new Date(utc + (1000 * offset));

    return newDate;
  }

  async function updateData(lat, lon, searchTerm) {
    const weatherOptions = {
      method: 'GET',
      url: '/api/openweather',
      params: { lat, lon }
    }
    try {
      let fetchedWeather = await axios.request(weatherOptions);
      setWeatherData(fetchedWeather.data);
      setUtcOffset(fetchedWeather.data.timezone);
    } catch (error) {
      setWeatherData(null);
      setUtcOffset(null);
    }

    const bgOptions = {
      method: 'GET',
      url: '/api/image',
      params: { searchTerm }
    }

    let fetchedBg = await axios.request(bgOptions);
    setBackground(fetchedBg.data.link);
    setBgContextLink(fetchedBg.data.image.contextLink);
  }

  useEffect(() => {
    clearInterval(timeInterval.current);
    timeInterval.current = setInterval(() => {
      if (utcOffset !== null) {
        let calculatedTime = calculateLocalTime(utcOffset);
        let currentTime = calculatedTime.toTimeString().split(' ')[0];
        setLocalTime(currentTime);
        let currentDate = calculatedTime.toDateString();
        setLocalDate(currentDate);
      } else {
        setLocalTime(null);
        setLocalDate(null);
      }
    }, 1000)
  }, [weatherData, utcOffset]);

  useEffect(() => {
    let cityRegionCountry = `${city.name} ${city.region} ${city.country}`;
    if (city.region === city.name || city.region === undefined) {
      setCityName(city.name);
    } else {
      setCityName(`${city.name}, ${city.region}`);
    }

    updateData(city.latitude, city.longitude, cityRegionCountry);
  }, [city])

  const bgStyle = {
    backgroundImage: `url(${background})`
  };

  if (!city || weatherData === undefined || localTime === undefined) {
    return (<>Loading...</>)
  } else  {
    return (
      <div id="bg-layer" style={bgStyle}>
        <main>
          <h2>{cityName}</h2>
          <h3>{city.country}</h3>
          <CityBlock data={weatherData} time={localTime} date={localDate}></CityBlock>
        </main>
        {bgContextLink &&
        <footer>
          <div id="credit">
            <a href={bgContextLink} rel="noreferrer" target="_blank">Background image source</a>
          </div>
        </footer>
        }
      </div>
    )
  }
}

export default CityInfo;