using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AccountService.Services;
using AccountService.Controllers;
using AccountService.Resources;
using Xunit;
using NSubstitute;

namespace MainServiceTest
{
  public class AccountServiceTests
  {
    private readonly AccountController _accountController;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<AccountController> _logger;
    private readonly ISecurityService _securityService;

    public AccountServiceTests()
    {
      var store = Substitute.For<IUserStore<IdentityUser>>();
      _userManager = Substitute.For<UserManager<IdentityUser>>(store, null, null, null, null, null, null, null, null);
      _accountController = new AccountController(
        _userManager,
        _logger,
        _securityService);
    }

    [Fact]
    public async Task Login_ShouldFail_NoUser()
    {
      // Arrange
      _userManager.FindByEmailAsync("user@company.com").Returns<Task<IdentityUser>>(Task.FromResult<IdentityUser>(null));

      // Act
      var result = await _accountController.LoginWithEmailPasswordAsync(new AccountService.Resources.LoginRequest
      {
        Email = "not@exist.com",
        Password = "Password$0"
      });

      // Assert
      Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Login_ShouldFail_BadPassword()
    {
      // Arrange
      _userManager.FindByNameAsync("user@example.com")
        .Returns<Task<IdentityUser>>(Task.FromResult<IdentityUser>(new IdentityUser()));
      _userManager.CheckPasswordAsync(Arg.Any<IdentityUser>(), Arg.Any<string>())
        .Returns(false);

      // Act
      var result = await _accountController.LoginWithEmailPasswordAsync(new AccountService.Resources.LoginRequest
      {
        Email = "user@company.com",
        Password = "Password$0"
      });

      // Assert
      var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
      var errors = Assert.IsType<SerializableError>(badRequestResult.Value);
      Assert.True(errors.ContainsKey("BAD-CREDENTIALS"));
    }

    [Fact]
    public async Task Login_ShouldFail_LockedOut()
    {
      // Arrange
      _userManager.FindByNameAsync("user@company.com")
        .Returns<Task<IdentityUser>>(Task.FromResult<IdentityUser>(new IdentityUser()
        {
          LockoutEnd = DateTime.Now.AddHours(1)
        }));

      // Act
      var result = await _accountController.LoginWithEmailPasswordAsync(new AccountService.Resources.LoginRequest
      {
        Email = "user@company.com",
        Password = "Password$0"
      });

      // Assert
      var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
      var errors = Assert.IsType<SerializableError>(badRequestResult.Value);
      Assert.True(errors.ContainsKey("LOCKED-ACCOUNT"));
    }

    [Fact]
    public async Task Login_ShouldLogin()
    {
      // Arrange
      _userManager.FindByNameAsync("user@company.com")
        .Returns<Task<IdentityUser>>(Task.FromResult<IdentityUser>(new IdentityUser()
        {
          EmailConfirmed = true
        }));

      _userManager.CheckPasswordAsync(Arg.Any<IdentityUser>(), Arg.Any<string>())
        .Returns(true);
      _userManager.AccessFailedAsync(Arg.Any<IdentityUser>()).RunSynchronously();
      _userManager.UpdateAsync(Arg.Any<IdentityUser>()).RunSynchronously();
      _userManager.ResetAccessFailedCountAsync(Arg.Any<IdentityUser>()).RunSynchronously();

      _userManager.GetRolesAsync(Arg.Any<IdentityUser>())
        .Returns(new List<string>());

      _securityService.CreateToken(Arg.Any<string>(), Arg.Any<IList<string>>())
        .Returns("token");

      // Act
      var result = await _accountController.LoginWithEmailPasswordAsync(new AccountService.Resources.LoginRequest
      {
        Email = "user@company.com",
        Password = "Password$0"
      });

      // Assert
      var okResult = Assert.IsType<OkObjectResult>(result);
      var response = Assert.IsType<LoginResponse>(okResult.Value);
      Assert.Equal("token", response.Token);
    }
  }
}
