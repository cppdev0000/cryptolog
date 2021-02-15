using System.Collections.Generic;

namespace AccountService.Services
{
  public interface ISecurityService
  {
    string CreateToken(string userId, IList<string> roles);
  }
}
