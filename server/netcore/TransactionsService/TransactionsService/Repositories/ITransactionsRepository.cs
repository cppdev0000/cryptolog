using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TransactionsService.Models;
using TransactionsService.Resources;

namespace TransactionsService.Repositories
{
  public interface ITransactionsRepository
  {
    TransactionModel[] GetTransactions(string userId, DateTime? startDate = null, DateTime? endDate = null);

    Task<TransactionModel> GetTransactionAsync(int id);

    Task<SummaryResource> GetSummary(string userId);

    Dictionary<string, double> GetCoinSummary(string userId);

    void AddTransaction(TransactionModel transaction);

    void DeleteTransaction(TransactionModel transaction);

    void DeleteUserTransactions(string userId);

    Task Commit();
  }
}