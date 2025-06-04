using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Weather_App.Models;
using Weather_App.Services;
using static Weather_App.WeatherDTO.WeatherDTO;

namespace Weather_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherService _weatherService;
        public WeatherController(IWeatherService weatherService)
        {
            _weatherService = weatherService;
        }
        [HttpGet("current/date")]
        public async Task<IActionResult> GetCurrent(string city)
        {
            try
            {
                var result = await _weatherService.GetCurrentWeather(city);
                return Ok(new ApiResponse<WeatherResult>
                {
                    StatusCode = 200,
                    Message = "Weather data fetched successfully",
                    Data = result
                });
            }
            catch (HttpRequestException ex)
            {
                return BadRequest(new ApiResponse<string>
                {
                    StatusCode = 400,
                    Message = ex.Message,
                    Data = null
                });
            }
        }
        [HttpGet("history/from-date/to-date")]
        public async Task<IActionResult> GetHistory(string city, DateTime fromdate, DateTime todate)
        {
            try
            {
                var results = await _weatherService.GetWeatherHistory(city, fromdate, todate);
                return Ok(new ApiResponse<List<WeatherResult>>
                {
                    StatusCode = 200,
                    Message = "Historical weather data fetched successfully",
                    Data = results
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<string>
                {
                    StatusCode = 400,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>
                {
                    StatusCode = 500,
                    Message = ex.Message,
                    Data = null
                });
            }

        }
    }
}