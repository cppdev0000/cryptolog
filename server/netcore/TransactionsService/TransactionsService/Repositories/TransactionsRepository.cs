using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransactionsService.Data;
using TransactionsService.Models;
using TransactionsService.Resources;

namespace TransactionsService.Repositories
{
  public class TransactionsRepository : ITransactionsRepository
  {
    private readonly DataContext _context;

    //************************************************************************
    public TransactionsRepository(DataContext context)
    {
      _context = context;
    }

    //************************************************************************
    public TransactionModel[] GetTransactions(string userId, DateTime? startDate = null, DateTime? endDate = null)
    {
      var queryable = _context.Transactions
        .Where(x => x.UserId == userId);

      if (startDate.HasValue && endDate.HasValue)
      {
        queryable = queryable.Where(x => x.Date >= startDate && x.Date <= endDate);
      }

      var transactions = queryable
        .OrderByDescending(x => x.Date)
        .ToArray();

      return transactions;
    }

    //************************************************************************
    public async Task<TransactionModel> GetTransactionAsync(int id)
    {
      return await _context.Transactions.FindAsync(id);
    }

    //************************************************************************
    public async Task<SummaryResource> GetSummary(string userId)
    {
      // SELECT SUM(`Value`*`Count`), SUM(`Fee`) FROM transactions WHERE `userId`=userId

      return await _context.Transactions
        .Where(x => x.UserId == userId)
        .GroupBy(x => true)
        .Select(x => new SummaryResource
        {
          TotalInvested = x.Sum(y => y.Count * y.Value),
          TotalFees = x.Sum(y => y.Fee)
        })
        .FirstOrDefaultAsync();
    }

    //************************************************************************
    public Dictionary<string, double> GetCoinSummary(string userId)
    {
      // SELECT `CoinName`, SUM(`Count`) FROM Transactions WHERE `userId`=userId GROUP BY `CoinName`

      var coins = _context.Transactions
        .Where(x => x.UserId == userId)
        .AsNoTracking()
        .AsEnumerable()
        .GroupBy(x => x.CoinName)
        .ToDictionary(x => x.Key, y => y.Sum(z => z.Count));

      return coins.Where(x => x.Value > 0.0).ToDictionary(x => x.Key, y => y.Value);
    }

    //************************************************************************
    public void AddTransaction(TransactionModel transaction)
    {
      _context.Transactions.Add(transaction);
    }

    //************************************************************************
    public void DeleteTransaction(TransactionModel transaction)
    {
      _context.Transactions.Remove(transaction);
    }

    //************************************************************************
    public void DeleteUserTransactions(string userId)
    {
      var transactions = _context.Transactions.Where(x => x.UserId == userId);
      _context.Transactions.RemoveRange(transactions);

    }

    //************************************************************************
    public async Task Commit()
    {
      await _context.SaveChangesAsync();
    }
  }
}
