using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MainService.Data;
using MainService.Services;
using MainService.Controllers;
using Xunit;
using MainService.Resources;
using NSubstitute;

namespace MainServiceTest
{
  public class MainServiceTests
  {
    private readonly AccountController _accountController;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailService _emailService;
    private readonly ILogger<AccountController> _logger;
    private readonly ISecurityService _securityService;

    public MainServiceTests()
    {
      var store = Substitute.For<IUserStore<ApplicationUser>>();
      _userManager = Substitute.For<UserManager<ApplicationUser>>(store, null, null, null, null, null, null, null, null);
      _accountController = new AccountController(
        _userManager,
        _emailService,
        _logger,
        _securityService);
    }

    [Fact]
    public async Task Login_ShouldFail_NoUser()
    {
      // Arrange
      _userManager.FindByNameAsync("user@company.com").Returns<Task<ApplicationUser>>(Task.FromResult<ApplicationUser>(null));

      // Act
      var result = await _accountController.LoginWithEmailPasswordAsync(new MainService.Resources.LoginRequest
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
      _userManager.FindByNameAsync("user@company.com")
        .Returns<Task<ApplicationUser>>(Task.FromResult<ApplicationUser>(new ApplicationUser()));
      _userManager.CheckPasswordAsync(Arg.Any<ApplicationUser>(), Arg.Any<string>())
        .Returns(false);

      // Act
      var result = await _accountController.LoginWithEmailPasswordAsync(new MainService.Resources.LoginRequest
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
        .Returns<Task<ApplicationUser>>(Task.FromResult<ApplicationUser>(new ApplicationUser()
        {
          LockoutEnd = DateTime.Now.AddHours(1)
        }));

      // Act
      var result = await _accountController.LoginWithEmailPasswordAsync(new MainService.Resources.LoginRequest
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
        .Returns<Task<ApplicationUser>>(Task.FromResult<ApplicationUser>(new ApplicationUser()
        {
          EmailConfirmed = true
        }));

      _userManager.CheckPasswordAsync(Arg.Any<ApplicationUser>(), Arg.Any<string>())
        .Returns(true);
      _userManager.AccessFailedAsync(Arg.Any<ApplicationUser>()).RunSynchronously();
      _userManager.UpdateAsync(Arg.Any<ApplicationUser>()).RunSynchronously();
      _userManager.ResetAccessFailedCountAsync(Arg.Any<ApplicationUser>()).RunSynchronously();

      _userManager.GetRolesAsync(Arg.Any<ApplicationUser>())
        .Returns(new List<string>());

      _securityService.CreateToken(Arg.Any<int>(), Arg.Any<IList<string>>())
        .Returns("token");

      // Act
      var result = await _accountController.LoginWithEmailPasswordAsync(new MainService.Resources.LoginRequest
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
