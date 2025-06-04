using System.Text.Json;
using Weather_App.Models;

namespace Weather_App.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "abaf8bd0f0364c23cd7ea15329f9c589";
        public WeatherService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<WeatherResult> GetCurrentWeather(string city)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={_apiKey}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var data = JsonDocument.Parse(json).RootElement;

                return new WeatherResult
                {
                    City = city,
                    Temperature = data.GetProperty("main").GetProperty("temp").GetDouble(),
                    Description = data.GetProperty("weather")[0].GetProperty("description").GetString(),
                    Icon = data.GetProperty("weather")[0].GetProperty("icon").GetString(),
                    Date = DateTime.UtcNow
                };
            }
            catch
            {
                throw new HttpRequestException("Failed to retrieve current weather data.");
            }
        }
        public async Task<List<WeatherResult>> GetWeatherHistory(string city, DateTime from, DateTime to)
        {
            try
            {
                if ((to - from).TotalDays > 30)
                    throw new ArgumentException("Date range cannot exceed 30 days.");

                var results = new List<WeatherResult>();
                var date = from;
                while (date <= to)
                {
                    var current = await GetCurrentWeather(city);
                    current.Date = date;
                    results.Add(current);
                    date = date.AddDays(1);
                }

                return results;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching weather history: {ex.Message}");
            }
        }
    }
}
