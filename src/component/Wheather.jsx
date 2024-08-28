import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from './search.png';
import clear_icon from './clear.png';
import cloud_icon from './cloud.png';
import drizzle_icon from './drizzle.png';
import rain_icon from './rain.png';
import snow_icon from './snow.png';
import wind_icon from './wind.png';
import humidity_icon from './humidity.png';
import { Loader, Loader2 } from 'lucide-react';

export default function Weather() {
    const [weatherData, setWeatherData] = useState(false);
    const [city, setCity] = useState('Mumbai'); 
    const [inputValue, setInputValue] = useState('');
    const [loader,setLoader] = useState(true);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const search = async (city) => {
        try {
            setLoader(true);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fd6ee9f9e70baabfb4577ea283be7eab&units=metric`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.weather && data.weather.length > 0) {
                const icon = allIcons[data.weather[0].icon] || clear_icon;
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    icon: icon,
                });
                setInputValue('');
                setLoader(false);
            } else {
                console.log('data not found here');
                setWeatherData(false); 
            }
        } catch (error) {
            console.log('Error ffound here :', error);
            setWeatherData(false);
        }
    };

    useEffect(() => {
        search(city);
    }, [city]); 

    const handleSearchClick = () => {
        if (inputValue.trim() !== '') {
            setCity(inputValue);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="weather">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress} 
                />
                { 
                loader ? <div className='search-bar'> <Loader/></div> : <img src={search_icon} alt="" onClick={handleSearchClick} style={{ cursor: 'pointer' }} />
                }
            </div>
            {weatherData ? (
                <>  
                    <img src={weatherData.icon} alt="" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°C</p>
                    <p className="location">{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="" />
                            <div>
                                <p>{weatherData.windSpeed} km/hr</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>No weather data available</p>
            )}
        </div>
    );
}
