using TransactionsService.Models;
using TransactionsService.Resources;
using AutoMapper;

namespace TransactionsService.MappingProfiles
{
  public class Map : Profile
  {
    public Map()
    {
      CreateMap<TransactionModel, TransactionResource>()
        .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
      CreateMap<TransactionResource, TransactionModel>()
        .ForMember(x => x.Id, opt => opt.Ignore())
        .ForMember(x => x.CoinName, opt => opt.Condition(y => y.CoinName != null))
        .ForMember(x => x.Date, opt => opt.Condition(y => y.Date.HasValue))
        .ForMember(x => x.Count, opt => opt.Condition(y => y.Count.HasValue))
        .ForMember(x => x.Fee, opt => opt.Condition(y => y.Fee.HasValue))
        .ForMember(x => x.Type, opt => opt.Condition(y => y.Type.HasValue))
        .ForMember(x => x.Value, opt => opt.Condition(y => y.Value.HasValue));
    }
  }
}
