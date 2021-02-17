using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

namespace APIGateway
{
  public class Program
  {
    public static void Main(string[] args)
    {
      CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args)
    {
      return Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
          webBuilder.Configure(app =>
          {
            app.UseOcelot().Wait();
          });
        })
        .ConfigureAppConfiguration((hostingContext, config) =>
        {
          config.AddJsonFile("ocelot.json");
        })
        .ConfigureServices(s =>
        {
          s.AddOcelot();
        })
        .ConfigureLogging((hostingContext, logging) =>
        {
          //add your logging
        });
    }
  }
}
