TakeMeTo is a single-page web app that displays local information about any selected city in the world.

Heroku: https://pacific-inlet-54414.herokuapp.com/

The website's functionality includes:

- upon loading the page, your browser will prompt you for your location via the browser's Geolocation API. If you accept, it will automatically load the information for your current city
- a search bar at the top that allows you to select a city
  - this will display a results list populated by a list of cities provided by the GeoDB Cities API
- once you select a city, the main page will be updated to reflect the following information about the city:
  - local time and date (time zone offset is provided by OpenWeather API, then calculated in the frontend)
  - current weather (from OpenWeather API)
  - background image will be set to the first google image search result for that city (Google Custom Search Engine API)

Technologies used:
Frontend

- React
- HTML/CSS
- Axios
- Geolocation API for permission to access location
- Interface with backend via first-party API

Backend

- Express
- Axios
- Third-party APIs (GeoDB Cities, OpenWeather, Google CSE) to power the first-party API
