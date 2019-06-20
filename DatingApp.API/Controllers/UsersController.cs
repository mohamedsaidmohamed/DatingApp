using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize] 
    [Route("api/[controller]")]
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
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();
            var UsersToReturn=_IMapper.Map<IEnumerable<UserForListDto>>(users);
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


    }
}