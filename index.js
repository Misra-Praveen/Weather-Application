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




const getWeather = async (city) => {
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

searchBtn.addEventListener('click',
    ()=>{
        getWeather(inputBox.value.trim())
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



