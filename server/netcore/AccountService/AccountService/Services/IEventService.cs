using System.Threading.Tasks;

namespace AccountService.Services
{
  public interface IEventService
  {
    Task SendDeleteEvent(string userId);
  }
}
