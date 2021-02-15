using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TransactionsService.Repositories;
using EasyNetQ;

namespace TransactionsService.Services
{
  [Queue("DeleteTransactions")]
  public class DeleteTransactionsRequest
  {
    public string UserId { get; set; }
  }

  public class Worker : BackgroundService
  {
    private readonly ILogger<Worker> _logger;
    private readonly IConfiguration _configuration;
    private readonly IServiceProvider _serviceProvider;
    private readonly IBus _eventBus;

    //************************************************************************
    public Worker(
      IServiceProvider serviceProvider,
      ILogger<Worker> logger,
      IConfiguration configuration)
    {
      _serviceProvider = serviceProvider;
      _logger = logger;
      _configuration = configuration;

      string host = _configuration.GetConnectionString("EventBus");

      _eventBus = RabbitHutch.CreateBus($"host={host}");
      _logger.LogInformation("Event consumer running");
    }

    //************************************************************************
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      var subscriptionResult = _eventBus.PubSub.Subscribe<DeleteTransactionsRequest>("DeleteTransactionsId", HandleMessage, stoppingToken);
      _logger.LogInformation($"Subscribed to queue - {subscriptionResult.Queue.Name}");

      await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    //************************************************************************
    private async Task HandleMessage(DeleteTransactionsRequest msg)
    {
      _logger.LogInformation($"Delete event received {msg.UserId}");

      var transactionsRepository = _serviceProvider.GetRequiredService<ITransactionsRepository>();
      transactionsRepository.DeleteUserTransactions(msg.UserId);
      await transactionsRepository.Commit();
    }

    //************************************************************************
    public override void Dispose()
    {
      _logger.LogInformation("Event consumer shutting down");
      _eventBus.Dispose();
      base.Dispose();
    }
  }
}
