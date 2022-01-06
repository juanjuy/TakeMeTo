import React from 'react'
import CityInfo from './components/CityInfo';
import CityInput from './components/CityInput';
import { useState } from 'react';

const App = () => {
  const [selectedCity, setSelectedCity] = useState(undefined);

  const selectHandler = city => {
    if (selectedCity === undefined || city.id !== selectedCity.id) {
      setSelectedCity(city);
    }
  }
  if (selectedCity) {
    return (
      <>
        <header>
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
          <h1>Take Me To...</h1>
          <CityInput selectHandler={selectHandler}></CityInput>
        </header>
      </>
    )
  }
}

export default App;