using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Polly;

namespace AccountService.Data
{
  public class DataContext : IdentityDbContext<IdentityUser>
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
    }

    public void MigrateDB()
    {
      Policy
        .Handle<Exception>()
        .WaitAndRetry(10, x => TimeSpan.FromSeconds(5))
        .Execute(() => Database.Migrate());
    }
  }
}
