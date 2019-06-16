using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController] // without this attribute we will need to check modelstate in every action and return bad request with modelstate if it's not valid & we will need to use this attribute before params [frombody]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _AuthRepository;
        private readonly IConfiguration _config;
        public IMapper _Mapper { get; }
        public AuthController(IAuthRepository AuthRepository, IConfiguration config, IMapper mapper)
        {
            _Mapper = mapper;
            _AuthRepository = AuthRepository;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.username = userForRegisterDto.username.ToLower();

            var UserToCreate = new User()
            {
                Username = userForRegisterDto.username
            };

            if (await _AuthRepository.UserExist(userForRegisterDto.username))
            {
                return BadRequest("User Is Already Exist");
            }

            var createdUser = await _AuthRepository.Register(UserToCreate, userForRegisterDto.password);

            return StatusCode(201); //201 mean created
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {

            var User = await _AuthRepository.Login(userForLoginDto.Username, userForLoginDto.Password);
            if (User == null)
                return Unauthorized();

            var Clamis = new[] {
                new Claim(ClaimTypes.NameIdentifier,User.Id.ToString()),
                new Claim(ClaimTypes.Name,User.Username)
            };

            var key = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {

                Subject = new ClaimsIdentity(Clamis),
                Expires = System.DateTime.Now.AddDays(1),
                SigningCredentials = cred
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var LoggedInuser = _Mapper.Map<UserForListDto>(User);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                LoggedInuser
            });
        }
    }
}