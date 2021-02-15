using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransactionsService.Models
{
  public class TransactionModel
  {
    [Key]
    public int Id { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime Date { get; set; }

    [Required]
    public string CoinName { get; set; }

    [Required]
    public int Type { get; set; }

    [Required]
    public double Count { get; set; }

    [Required]
    public double Value { get; set; }

    [Required]
    public double Fee { get; set; }

    [Required]
    public string UserId { get; set; }
  }
}
