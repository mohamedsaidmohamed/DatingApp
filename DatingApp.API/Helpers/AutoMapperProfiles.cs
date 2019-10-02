using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{

    public class AutoMapperProfiles : Profile
    {
       public AutoMapperProfiles()
       {
        CreateMap<User,UserForListDto>()
        .ForMember(dest =>dest.PhotoUrl,opt =>{
            opt.MapFrom(src =>src.Photos.FirstOrDefault(q=>q.IsMain).Url);
        })
        .ForMember(dest => dest.Age,opt=> {
            opt.ResolveUsing(d=>d.DateOfBirth.CalculateAge());
        })
        ;
        CreateMap<User,UserForDetailedDto>()
           .ForMember(dest =>dest.PhotoUrl,opt =>{
            opt.MapFrom(src =>src.Photos.FirstOrDefault(q=>q.IsMain).Url);
        })
         .ForMember(dest => dest.Age,opt=> {
            opt.ResolveUsing(d=>d.DateOfBirth.CalculateAge());
        })
        ;
        CreateMap<Photo,PhotosForDetailedDto>();
        CreateMap<UserForUpdateDto,User>();
        CreateMap<Photo,PhotoForReturnDto>();
        CreateMap<PhotoForCreationDto,Photo>();
        CreateMap<UserForRegisterDto,User>();
        CreateMap<MessageForCreationDto,Message>().ReverseMap();
        CreateMap<Message,MessageForReturnDto>()
        .ForMember(x=>x.SenderPhotoUrl,opt=>opt.MapFrom(q=>q.Sender.Photos.FirstOrDefault(a=>a.IsMain).Url))
        .ForMember(x=>x.RecipientPhotoUrl,opt=>opt.MapFrom(q=>q.Recipient.Photos.FirstOrDefault(a=>a.IsMain).Url));

        
       } 
    }
}