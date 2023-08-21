using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;

IConfiguration configuration = new ConfigurationBuilder()
    .AddUserSecrets<Program>()
    .Build();

// Login
var authority = $"https://login.microsoftonline.com/{configuration["TenantId"]}";
var scopes = new string[] { 
    configuration["Scope"],
    "openid",
    "profile"
};
var app = ConfidentialClientApplicationBuilder
    .Create(configuration["ClientId"])
    .WithClientSecret(configuration["ClientSecret"])
    .WithAuthority(new Uri(authority))
    .Build();
var authenticationResult = app.AcquireTokenForClient(scopes).ExecuteAsync().Result;

// Test Access Token, all methods should work except for get-auth-admin
var methods = new string[] { "get-anon", "get-auth", "get-auth-admin", "get-auth-device" };
using var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authenticationResult.AccessToken);
foreach (var method in methods)
{
    var url = $"https://localhost:7032/WeatherForecast/{method}";
    try
    {
        var httpResponseMessage = httpClient.GetAsync(url).Result;
        httpResponseMessage.EnsureSuccessStatusCode();
        Console.WriteLine($"Success calling {method}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error calling {method}:");
        Console.WriteLine($"\t{ex.Message}");
    }
}
