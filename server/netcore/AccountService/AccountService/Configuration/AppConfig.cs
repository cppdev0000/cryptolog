
namespace AccountService.Configuration
{
  public class JWTTokenConfig
  {
    public string Secret { get; set; }

    public string Issuer { get; set; }

    public string Audience { get; set; }

    public int Timeout { get; set; }
  }

  public class AppConfig
  {
    public AppConfig() {}

    public JWTTokenConfig JWTToken { get; set; }
  }
}
