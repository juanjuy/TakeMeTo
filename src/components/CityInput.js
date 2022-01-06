import axios from 'axios';
import React, { useState, useEffect } from 'react'
let currentTimeout;

const CityInput = ({ selectHandler }) => {
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [cityList, setCityList] = useState([]);
  const [resultStatus, setResultStatus] = useState(-1);

  if (cityList.length === 0 && searchValue.length === 0 && resultStatus !== -1) setResultStatus(-1);

  const handleSearchChange = event => {
    setSearchText(event.target.value);
    clearTimeout(currentTimeout);

    currentTimeout = setTimeout(() => {
      setSearchValue(event.target.value);
    }, 1000);
  }

  const handleSelectAndReset = city => {
    return function() {
      clearTimeout(currentTimeout);
      setCityList([]);
      setSearchValue('');
      setSearchText('');
      selectHandler(city);
    }
  }

  useEffect(() => {
    let inputElement = document.querySelector('#input');
    let resultsElement = document.querySelector('#results');

    inputElement.addEventListener('focusout', event => {
      setTimeout(() => {
        resultsElement.style.display = 'none';
      }, 200)
    })

    inputElement.addEventListener('focus', event => {
      resultsElement.style.display = 'block';
    })
  }, [])

  useEffect(() => {
    if (searchValue) {
      async function fetchData() {
        const options = {
          method: 'GET',
          url: '/api/citylist',
          params: {searchText: searchValue}
        }
        let fetchedCities = await axios.request(options);
        setCityList(fetchedCities.data);
        if (fetchedCities.data.length > 0) setResultStatus(1);
        else setResultStatus(0);
      }
      fetchData();
    } else {
      setCityList([]);
    }
  }, [searchValue]);

  return (
    <div id='input-block'>
      <img id="search-icon" src="/images/search.png" alt="search icon"/>
      <input id='input' autocomplete="off" value={searchText} onChange={handleSearchChange} placeholder="enter a city" />
      <ul id="results">
        {(resultStatus === 0 && searchValue) &&
          <li>No results</li>
        }
        {cityList.map(city => {
          let cityName;
          if (city.region === city.name || city.region === undefined) {
            cityName = city.name;
          } else {
            cityName = `${city.name}, ${city.region}`
          }
          return (
            <li key={city.id} onClick={handleSelectAndReset(city)}>{cityName} <span className="country">{city.country}</span></li>
          )
        })}
      </ul>
    </div>
  )
}

export default CityInput;