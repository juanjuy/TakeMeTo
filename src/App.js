import React from 'react'
import CityInfo from './components/CityInfo';
import CityInput from './components/CityInput';
import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [selectedCity, setSelectedCity] = useState(undefined);

  const selectHandler = city => {
    if (selectedCity === undefined || city.id !== selectedCity.id) {
      setSelectedCity(city);
    }
  }

  useEffect(() => {
    const success = async (pos) => {
      let crds = pos.coords;
      const options = {
        method: 'GET',
        url: '/api/citylist',
        params: {location: `${crds.latitude}${crds.longitude}`}
      }
      let fetchedCity = await axios.request(options);
      setSelectedCity(fetchedCity.data[0]);
    }
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  if (selectedCity) {
    return (
      <>
        <header>
          <div id="gh-link">Created by <a href="https://github.com/juanjuy">Juan Juy</a></div>
          <h1>
            Take Me To...
          </h1>
          <CityInput selectHandler={selectHandler}></CityInput>
        </header>
        <CityInfo city={selectedCity}></CityInfo>
      </>
    )
  } else {
    return (
      <>
        <header>
          <div id="gh-link">Created by <a href="https://github.com/juanjuy">Juan Juy</a></div>
          <h1>Take Me To...</h1>
          <CityInput selectHandler={selectHandler}></CityInput>
        </header>
      </>
    )
  }
}

export default App;