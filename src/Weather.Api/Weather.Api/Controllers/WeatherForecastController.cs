using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace Weather.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("get-anon")]
        [AllowAnonymous]
        public IEnumerable<WeatherForecast> GetAnon()
        {
            return Get();
        }

        [HttpGet("get-auth")]
        [Authorize]
        public IEnumerable<WeatherForecast> GetAuth()
        {
            return Get();
        }

        [HttpGet("get-auth-admin")]
        [Authorize(Roles = "weather.admins")]
        public IEnumerable<WeatherForecast> GetAuthAdmin()
        {
            return Get();
        }

        [HttpGet("get-auth-device")]
        [Authorize(Roles = "weather.devices")]
        public IEnumerable<WeatherForecast> GetAuthDevice()
        {
            return Get();
        }
    }
}