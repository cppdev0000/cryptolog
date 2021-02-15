using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TransactionsService.Configuration;
using TransactionsService.Data;
using TransactionsService.Repositories;
using AutoMapper;
using TransactionsService.Services;
using System.Reflection;
//using Microsoft.Extensions.Http.Polly;

namespace TransactionsService
{
  public class Startup
  {
    private readonly IConfiguration Configuration;

    //************************************************************************
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    //************************************************************************
    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      // Configuration
      services.Configure<AppConfig>(Configuration.GetSection("App"));
      services.Configure<JWTTokenConfig>(Configuration.GetSection("JWTToken"));

      services.AddControllers()
        .AddJsonOptions(options =>
        {
          options.JsonSerializerOptions.IgnoreNullValues = true;
        });

      services.AddHttpClient<IPriceService, PriceService>();
        /*.AddTransientHttpErrorPolicy(builder => builder.WaitAndRetryAsync(new[]
        {
          TimeSpan.FromSeconds(1),
          TimeSpan.FromSeconds(5),
          TimeSpan.FromSeconds(10)
        }));*/
      //Policy.Handle<Exception>().Retry(7);
      //Policy.Handle<Exception>().CircuitBreaker(3, TimeSpan.FromMinutes(1));
    //}

      // Services
      services.AddAutoMapper();
      services.AddScoped<IUnitOfWork, UnitOfWork>();
      services.AddScoped<ITransactionsRepository, TransactionsRepository>();
      services.AddHostedService<Worker>();

      services.AddStackExchangeRedisCache(options =>
      {
        options.Configuration = Configuration.GetConnectionString("Redis");
        var assemblyName = Assembly.GetExecutingAssembly().GetName();
        options.InstanceName = assemblyName.Name + "_";
      });

      // DB context
      services.AddDbContext<DataContext>(options =>
        options.UseMySql(Configuration.GetConnectionString("MyDB"), ServerVersion.AutoDetect(Configuration.GetConnectionString("MyDB"))));

      // Authentication
      services.AddIdentity<IdentityUser, IdentityRole>()
        .AddEntityFrameworkStores<DataContext>()
        .AddDefaultTokenProviders();

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
       .AddJwtBearer(options =>
       {
         options.TokenValidationParameters = new TokenValidationParameters()
         {
           ValidateAudience = false,
           ValidateIssuer = false,
           ValidateIssuerSigningKey = true,
           IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWTToken:Secret"]))
         };
       });

      services.AddHealthChecks();

      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "User Service API", Version = "v1" });
      });
    }

    //************************************************************************
    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      app.UseHealthChecks("/health");

      app.UseAuthentication();

      if (env.IsDevelopment())
      {
        app.UseCors(p => p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
      }

      app.UseRouting();
      app.UseAuthorization();
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });

      app.UseSwagger();
      app.UseSwaggerUI(c =>
      {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "User Service API - v1");
      });
    }
  }
}
