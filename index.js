const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const middleware = require('./utils/middleware');
const app = express();
app.use(cors());
app.use(express.static('build'));
app.use(middleware.requestLogger);

function removeDupeCities(cityList) {
	let seen = [];
	return cityList.filter(city => {
		if (seen.includes(city.name + city.region)) return false;
		seen.push(city.name + city.region);
		return true;
	});
}

app.get('/api/citylist', async (req, res) => {
	try {
		let citiesResponse = await axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=10&sort=-population&namePrefix=${req.query.searchText || ''}&location=${req.query.location || ''}`);
		console.log(citiesResponse);
		res.json(removeDupeCities(citiesResponse.data.data));
	} catch (error) {
		res.json([]);
	}
});

app.get('/api/openweather', async (req, res) => {
	let options = {
		method: 'GET',
		url: `http://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${process.env.OPENWEATHER_API_KEY}`
	};
	try {
		let weatherResponse = await axios.request(options);
		res.json(weatherResponse.data);
	} catch (error) {
		res.status(404).send({ content: 'issue fetching weather' });
	}
});

app.get('/api/image', async (req, res) => {
	let options = {
		method: 'GET',
		url: `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_CSE_API_KEY}&cx=67ce40c32ca91b104&searchType=image&imgType=photo&imgSize=huge&num=1&rights=cc_publicdomain&q=${req.query.searchTerm}`,
	};

	try {
		let imageResponse = await axios.request(options);
		return res.json(imageResponse.data.items[0]);
	} catch (error) {
		return res.status(201).send({
			link: '/images/defaultbg',
			image: {
				contextLink: 'https://wallpaperaccess.com/4k-earth'
			}
		});
	}
});

app.get('/images/defaultbg', (req, res) => {
	res.sendFile(__dirname + '/images/defaultbg.jpg');
});

app.get('/images/search.png', (req, res) => {
	res.sendFile(__dirname + '/images/search.png');
});

app.use(middleware.unknownEndpoint);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});