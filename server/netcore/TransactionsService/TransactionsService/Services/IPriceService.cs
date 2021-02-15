using System.Collections.Generic;
using System.Threading.Tasks;

namespace TransactionsService.Services
{
  public interface IPriceService
  {
    Task<Dictionary<string, double>> GetPricesAsync(IEnumerable<string> coins);
  }
}
