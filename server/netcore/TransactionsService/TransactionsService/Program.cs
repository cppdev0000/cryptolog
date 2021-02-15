using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using TransactionsService.Services;

namespace TransactionsService
{
  public class Program
  {
    public static void Main(string[] args)
    {
      BuildWebHost(args).Run();
    }

    public static IWebHost BuildWebHost(string[] args)
    {
      return WebHost.CreateDefaultBuilder(args)
        .ConfigureServices((hostContext, services) =>
        {
          services.AddHostedService<Worker>();
        })
        .UseStartup<Startup>()
        .Build();
    }
  }
}
