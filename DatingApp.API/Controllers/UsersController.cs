using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize] 
    [Route("api/[controller]")]
    //[Route("api/v{version:apiversion}/[controller]")]  
    [ApiVersion("1.1")]
    [ApiVersion("1.2")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _IMapper;
        public UsersController(IDatingRepository repo, IMapper IMapper)
        {
            this._IMapper = IMapper;
            this._repo = repo;
        }

        [HttpGet]
        [MapToApiVersion("1.1")]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams UserParams)
        {
            var CurrentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            UserParams.UserId = CurrentUserId ;

            var UserFromRepo=await _repo.GetUser(CurrentUserId);

            if(string.IsNullOrEmpty(UserParams.Gender))
            {
                UserParams.Gender=UserFromRepo.Gender=="male"?"female":"male";
            }

            var users = await _repo.GetUsers(UserParams);

            var UsersToReturn=_IMapper.Map<IEnumerable<UserForListDto>>(users);
            Response.AddPagaination(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);

            return Ok(UsersToReturn);
        }

        [HttpGet]
        [MapToApiVersion("1.2")]
        public async Task<IActionResult> GetUsersFemalesOnly([FromQuery]UserParams UserParams)
        {
            var CurrentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            UserParams.UserId = CurrentUserId ;

            var UserFromRepo=await _repo.GetUser(CurrentUserId);

            // if(string.IsNullOrEmpty(UserParams.Gender))
            // {
                UserParams.Gender="female";
            //}

            var users = await _repo.GetUsers(UserParams);

            var UsersToReturn=_IMapper.Map<IEnumerable<UserForListDto>>(users);
            Response.AddPagaination(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);

            return Ok(UsersToReturn);
        }

        [HttpGet("{Id}",Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            var UserToReturn=_IMapper.Map<UserForDetailedDto>(user);
            return Ok(UserToReturn);
        }
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateUser(int id,UserForUpdateDto UserForUpdate){
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var UserFromRepo = await _repo.GetUser(id);

            _IMapper.Map(UserForUpdate,UserFromRepo);

            if(await _repo.SaveAll())
                return NoContent();

            throw new System.Exception($"User with {id} failed to update!");

        }

        [HttpPost("{id}/like/{recipientid}")]
        public async Task<IActionResult> LikeUser(int id, int recipientid)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return  Unauthorized();

            var likefromRepo =await _repo.GetLike(id,recipientid); 
            if(likefromRepo!=null)
            {
                return BadRequest("You already like this user !");
            }
            
            var recipientUser=await _repo.GetUser(recipientid);
            if(recipientUser==null)
                return NotFound();

            var like=new Like{
                LikeeId=recipientid,
                LikerId=id
            };

            _repo.Add<Like>(like);
            if(await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to like user");
        }   


    }
}