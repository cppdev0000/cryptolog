using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace TransactionsService.Services
{
  public class PriceService : IPriceService
  {
    private readonly HttpClient _httpClient;
    private readonly IDistributedCache _cache;
    private readonly ILogger<PriceService> _logger;
    private readonly DistributedCacheEntryOptions _cacheOptions;

    //************************************************************************
    public PriceService(
      HttpClient httpClient,
      IDistributedCache cache,
      ILogger<PriceService> logger)
    {
      _httpClient = httpClient;
      _cache = cache;
      _logger = logger;

      _cacheOptions = new DistributedCacheEntryOptions()
      {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(5 * 60)
      };
    }

    //************************************************************************
    // Get current prices for list of coins
    public async Task<Dictionary<string, double>> GetPricesAsync(IEnumerable<string> coins)
    {
      Dictionary<string, double> allCoins;

      // Check cache
      var value = await _cache.GetStringAsync(Constants.COIN_PRICES_CACHE_KEY);
      if (value != null)
      {
        _logger.LogInformation("Found coin prices in cache");
        allCoins = JsonConvert.DeserializeObject<Dictionary<string, double>>(value);
      }
      else
      {
        _logger.LogInformation("Retrieving latest prices");
        allCoins = await GetLatestPrices();

        value = JsonConvert.SerializeObject(allCoins);
        await _cache.SetStringAsync(Constants.COIN_PRICES_CACHE_KEY, value, _cacheOptions);
        _logger.LogInformation("Coin prices cached");
      }

      // Only return requested coin prices
      var requestedCoins = new Dictionary<string, double>();
      foreach(var coin in coins)
      {
        requestedCoins[coin] = allCoins[coin];
      }

      return requestedCoins;
    }

    //************************************************************************
    private Task<Dictionary<string, double>> GetLatestPrices()
    {
      // TODO: Get actual prices from external API
      // Just fake data for now
      var prices = new Dictionary<string, double>()
      {
        ["BTC"] = 10000.0,
        ["ETH"] = 10000.0,
        ["LTC"] = 10000.0,
        ["ADA"] = 10000.0,
        ["ALGO"] = 10000.0,
        ["XRP"] = 10000.0,
        ["LINK"] = 10000.0
      };

      return Task.FromResult(prices);
    }
  }
}
