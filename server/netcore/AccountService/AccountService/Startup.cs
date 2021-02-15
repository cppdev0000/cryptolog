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
using AccountService.Data;
using AccountService.Services;

namespace AccountService
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
      services.AddControllers()
        .AddJsonOptions(options =>
        {
          options.JsonSerializerOptions.IgnoreNullValues = true;
        });

      // Services
      services.AddSingleton<ISecurityService, SecurityService>();
      services.AddSingleton<IEventService, EventService>();

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
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Account Service API", Version = "v1" });
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
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Account Service API - v1");
      });
    }
  }
}
