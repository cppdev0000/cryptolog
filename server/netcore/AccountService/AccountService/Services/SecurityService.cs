using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AccountService.Services
{
  public class SecurityService : ISecurityService
  {
    private readonly IConfiguration _configuration;

    //************************************************************************
    public SecurityService(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    //************************************************************************
    public string CreateToken(string userId, IList<string> roles)
    {
      var claims = new List<Claim>
      {
        new Claim(ClaimTypes.NameIdentifier, userId),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
      };

      foreach (var role in roles)
      {
        claims.Add(new Claim(ClaimTypes.Role, role));
      }

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTToken:Secret"]));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
      JwtSecurityToken token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JWTToken:Timeout")),
        signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
