using System;

namespace TransactionsService.Resources
{
  public class TransactionResource
  {
    public int Id { get; set; }

    public DateTime? Date { get; set; }

    public string CoinName { get; set; }

    public int? Type { get; set; }

    public double? Count { get; set; }

    public double? Value { get; set; }

    public double? Fee { get; set; }
  }
}
