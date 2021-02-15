using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using EasyNetQ;

namespace AccountService.Services
{
  [Queue("DeleteTransactions")]
  public class DeleteTransactionsRequest
  {
    public string UserId { get; set; }
  }

  public class EventService : IEventService, IDisposable
  {
    private readonly IConfiguration _configuration;
    private readonly ILogger<EventService> _logger;
    private readonly IBus _eventBus;

    //************************************************************************
    public EventService(ILogger<EventService> logger, IConfiguration configuration)
    {
      _configuration = configuration;
      _logger = logger;

      string host = _configuration.GetConnectionString("EventBus");

      _eventBus = RabbitHutch.CreateBus($"host={host}");
    }

    //************************************************************************
    public async Task SendDeleteEvent(string userId)
    {
      var request = new DeleteTransactionsRequest
      {
        UserId = userId
      };

      _logger.LogInformation($"Publishing delete user event {userId}");
      await _eventBus.PubSub.PublishAsync<DeleteTransactionsRequest>(request);
    }

    //************************************************************************
    public void Dispose()
    {
      _eventBus.Dispose();
    }
  }
}
