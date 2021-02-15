using Microsoft.EntityFrameworkCore;
using TransactionsService.Models;

namespace TransactionsService.Data
{
  public class DataContext : DbContext
  {
    public DbSet<TransactionModel> Transactions { get; set; }

    public DataContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      //modelBuilder.Entity<TransactionModel>().Property(x => x.Date).HasDefaultValueSql("NOW()");
    }
  }
}
