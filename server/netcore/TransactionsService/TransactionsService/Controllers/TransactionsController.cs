using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TransactionsService.Repositories;
using TransactionsService.Resources;
using TransactionsService.Models;
using TransactionsService.Services;
using AutoMapper;

namespace TransactionsService.Controllers
{
  [ApiController]
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
  [Route("api/[controller]")]
  public class TransactionsController : ControllerBase
  {
    private readonly ITransactionsRepository _transactionsRepository;
    private readonly ILogger<TransactionsController> _logger;
    private readonly IMapper _mapper;

    public TransactionsController(
      ITransactionsRepository transactionsRepository,
      ILogger<TransactionsController> logger,
      IMapper mapper)
    {
      _transactionsRepository = transactionsRepository;
      _logger = logger;
      _mapper = mapper;
    }

    //************************************************************************
    [HttpGet]
    public IActionResult GetTransactions([FromQuery] string date)
    {
      string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

      DateTime? startDate = null;
      DateTime? endDate = null;
      if (date != null)
      {
        int year = int.Parse(date.Substring(0, 4));
        int month = int.Parse(date.Substring(4));
        startDate = new DateTime(year, month, 1);
        endDate = startDate.Value.AddMonths(1).AddSeconds(-1);
      }

      return Ok(_mapper.Map<TransactionResource[]>(_transactionsRepository.GetTransactions(userId, startDate, endDate)));
    }

    //************************************************************************
    [HttpPost]
    public async Task<IActionResult> AddTransactionAsync([FromBody] TransactionResource resource)
    {
      string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

      var transactionModel =_mapper.Map<TransactionModel>(resource);
      transactionModel.UserId = userId;

      _transactionsRepository.AddTransaction(transactionModel);
      await _transactionsRepository.Commit();

      return Ok(_mapper.Map<TransactionResource>(transactionModel));
    }

    //************************************************************************
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateTransactionAsync([FromRoute] int id, [FromBody] TransactionResource resource)
    {
      var transaction = await _transactionsRepository.GetTransactionAsync(id);
      if (transaction == null)
      {
        return NotFound();
      }

      _mapper.Map<TransactionResource, TransactionModel>(resource, transaction);
      await _transactionsRepository.Commit();

      return Ok(_mapper.Map<TransactionResource>(transaction));
    }

    //************************************************************************
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransactionAsync([FromRoute] int id)
    {
      var transaction = await _transactionsRepository.GetTransactionAsync(id);
      if (transaction != null)
      {
        _transactionsRepository.DeleteTransaction(transaction);
        await _transactionsRepository.Commit();
      }

      return NoContent();
    }

    //************************************************************************
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaryAsync()
    {
      string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

      return Ok(await _transactionsRepository.GetSummary(userId));
    }

    //************************************************************************
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentAsync([FromServices]IPriceService priceService)
    {
      string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

      var coinSummary = _transactionsRepository.GetCoinSummary(userId);

      // Get current prices for selected coins
      var prices = await priceService.GetPricesAsync(coinSummary.Keys);
      foreach(var price in prices)
      {
        coinSummary[price.Key] = coinSummary[price.Key] * price.Value;
      }

      return Ok(coinSummary);
    }
  }
}
