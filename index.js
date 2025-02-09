const API_KEY = "9b233636e5f0c69344d203329dc11ab4";
const inputBox = document.getElementById('cityInput');
const searchBtn = document.getElementById('getWeather');
const weather_img = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature') ;
const windSpeed=document.getElementById('windSpeed');
const humidity=document.getElementById('humidity');
const currentLocation = document.getElementById('currentLocation');
const weatherResult = document.getElementById('weatherResult');
const cityName = document.getElementById('cityName')
const description = document.getElementById('description')
const recentCitiesDropdown = document.getElementById('recentCities');
const forecastContainer = document.getElementById('forecastContainer');
const forecastTitle = document.getElementById('forecastTitle');

function loadRecentCities(){
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if(cities.length>0){
        recentCitiesDropdown.classList.remove('hidden');
        recentCitiesDropdown.innerHTML = `<option value="">Select Recent City</option>` + cities.map(city=>`<option value="${city}">${city}</option>`).join("");
    }else {
        recentCitiesDropdown.classList.add('hidden');
    }
}

function saveRecentCity(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];  
    if (!Array.isArray(cities)) cities = [];  // Double-check in case of corruption

    if (!cities.includes(city)) {
        cities.unshift(city);  // Add city to the beginning
        if (cities.length > 5) cities.pop();  // Limit to last 5 cities
        localStorage.setItem('recentCities', JSON.stringify(cities));
    }
    loadRecentCities();
}

recentCitiesDropdown.addEventListener('change', (event) => {
    if (event.target.value) getWeather(event.target.value);
});

const getWeather = async (city) => {

    if(!city){
        return;
    }
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        const data = await response.json();
    
        if (data.cod !== 200) {
            alert("City not found!");
            return;
        }

        displayWeather(data);
        saveRecentCity(city);
        getForecast(city);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
};
// Fetch and display 5-day forecast
const getForecast = async (city) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.cod !== "200") {
            console.error("Error fetching forecast:", data.message);
            return;
        }

        displayForecast(data.list);
    } catch (error) {
        console.error("Error fetching 5-day forecast:", error);
    }
};
const getForecastByCoords = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.cod !== "200") {
            console.error("Error fetching forecast:", data.message);
            return;
        }

        displayForecast(data.list);
    } catch (error) {
        console.error("Error fetching forecast for location:", error);
    }
};

searchBtn.addEventListener('click',
    ()=>{
        
        getWeather(inputBox.value.trim());
    }
)

function displayWeather(data){
    weatherResult.style.display = "block";
    cityName.textContent=`${data.name}, ${data.sys.country}`;
    temperature.textContent=`Temperature: ${Math.round(data.main.temp - 273.15)}°C`;
    description.textContent= `${data.weather[0].main}` ;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;


    const desc = description.innerText;
    if(desc == 'Clear'){
        weather_img.src = "./assets/Clear.png";
    } else if (desc == 'Cloud'){
        weather_img.src = "./assets/Cloud.png";
    }
    else if (desc == 'Clouds'){
        weather_img.src = "./assets/Clouds.png";
    } 
    else if (desc == 'Haze'){
        weather_img.src = "./assets/Haze.png";
        
    }
    else if (desc == 'Light rain'){
        weather_img.src = "./assets/Light_rain.png";
    }
    else if (desc == 'Snow'){
        weather_img.src = "./assets/Snow.webp";
    }
    else if (desc == 'Smoke'){
        weather_img.src = "./assets/Smoke.png";
    }
    else{
        weather_img.src = "./assets/Rain.png";
    }
}

function displayForecast(forecastList) {
    forecastContainer.innerHTML = ""; // Clear previous data
    forecastTitle.style.display='block';
    for (let i = 0; i < forecastList.length; i += 8) { // API provides 3-hour intervals, so pick every 8th
        const forecast = forecastList[i];

        const date = new Date(forecast.dt_txt).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
        const temp = `${Math.round(forecast.main.temp)}°C`;
        const wind = `${forecast.wind.speed} m/s`;
        const humidity = `${forecast.main.humidity}%`;
        const icon = `./assets/${forecast.weather[0].main.toLowerCase()}.png`;

        const forecastItem = `
            <div class="forecast-item bg-gray-800 p-3 rounded-md text-center">
                <p class="text-lg font-semibold">${date}</p>
                <img src="${icon}" class="w-12 mx-auto" alt="${forecast.weather[0].main}">
                <p>${temp}</p>
                <p>Wind: ${wind}</p>
                <p>Humidity: ${humidity}</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastItem;
    }
}

currentLocation.addEventListener('click',()=>{
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude)
            getWeatherByCurrentLocation(latitude, longitude);
            
        },
        (error)=>{
            alert("Geolocation is not supported or permission denied.");
        }
    )}
    else {
        alert("Geolocation is not supported by this browser.");
    }
});

const getWeatherByCurrentLocation = async (lat, lon)=> {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const data = await response.json();
        console.log(data);
        if (data.cod !== 200) {
            alert("Location not found!");
            return;
        }

        displayWeather(data);
        getForecastByCoords(lat, lon);
    }
    catch (error){
        console.error("Error fetching weather data:", error);
    }

}


