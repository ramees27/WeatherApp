using Weather_App.Models;

namespace Weather_App.Services
{
    public interface IWeatherService
    {
        Task<WeatherResult> GetCurrentWeather(string city);
        Task<List<WeatherResult>> GetWeatherHistory(string city, DateTime from, DateTime to);
    }
}
