using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AccountService.Resources;
using AccountService.Services;

namespace AccountService.Controllers
{
  [ApiController]
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly ILogger<AccountController> _logger;
    private readonly UserManager<IdentityUser> _userMgr;
    private readonly ISecurityService _securityService;

    public AccountController(
      UserManager<IdentityUser> userMgr,
      ILogger<AccountController> logger,
      ISecurityService securityService)
    {
      _logger = logger;
      _userMgr = userMgr;
      _securityService = securityService;
    }

    //************************************************************************
    [AllowAnonymous]
    [HttpPost("register")]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest request)
    {
      var user = new IdentityUser
      {
        UserName = request.Email,
        Email = request.Email,
        EmailConfirmed = true
      };

      var result = await _userMgr.CreateAsync(user, request.Password);
      if (!result.Succeeded)
      {
        return Problem(statusCode: 400, title: result.Errors.First().Code, detail: result.Errors.First().Description);
      }

      return NoContent();
    }

    //************************************************************************
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> LoginWithEmailPasswordAsync([FromBody] LoginRequest data)
    {
      var user = await _userMgr.FindByNameAsync(data.Email);
      if (user == null)
      {
        ModelState.AddModelError("BAD-CREDENTIALS", "Wrong email and/or password");

        return BadRequest(ModelState);
      }

      // Check lockout flag before attempting login
      if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.Now)
      {
        ModelState.AddModelError("LOCKED-ACCOUNT", "Account is locked");

        return BadRequest(ModelState);
      }

      // Check password
      if (!await _userMgr.CheckPasswordAsync(user, data.Password))
      {
        // Increment failed login count
        await _userMgr.AccessFailedAsync(user);

        // Set LastLockedDate if account is now locked
        if (user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow)
        {
          //user.LastLockedDate = DateTime.Now;
          await _userMgr.UpdateAsync(user);
        }

        ModelState.AddModelError("BAD-CREDENTIALS", "Wrong email and/or password");

        return BadRequest(ModelState);
      }

      // Login successful, ensure failed counter is reset to 0
      await _userMgr.ResetAccessFailedCountAsync(user);

      // Check app config to see if we should fail login if email is not validated
      if (!user.EmailConfirmed)
      {
        ModelState.AddModelError("EMAIL-UNVALIDATED-ERROR", "Email has not been validated");

        return BadRequest(ModelState);
      }

      var login = new LoginResponse
      {
        Token = _securityService.CreateToken(user.Id, await _userMgr.GetRolesAsync(user)),
      };

      await _userMgr.UpdateAsync(user);

      return Ok(login);
    }

    //************************************************************************
    [HttpDelete]
    public async Task<IActionResult> DeleteAccount([FromServices] IEventService eventService)
    {
      string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      var user = await _userMgr.FindByIdAsync(userId);

      //await _userMgr.DeleteAsync(user);
      await eventService.SendDeleteEvent(userId);

      return NoContent();
    }
  }
}
