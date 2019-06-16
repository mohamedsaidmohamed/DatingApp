
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userid}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _CloudinaryConfig ;
        private readonly Cloudinary _Cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> CloudinaryConfig)
        {
            _CloudinaryConfig = CloudinaryConfig;
            _mapper = mapper;
            _repo = repo;

            Account acc =new Account(_CloudinaryConfig.Value.CloudName,_CloudinaryConfig.Value.ApiKey,_CloudinaryConfig.Value.ApiSecret);

            _Cloudinary =new Cloudinary(acc);
        }
        
        [HttpGet("{id}",Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo=await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }
        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,
        [FromForm] PhotoForCreationDto PhotoForCreationDto)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var UserFromRepo = await _repo.GetUser(userId);

            var file=PhotoForCreationDto.File;

            var uploadResult=new ImageUploadResult();
            
            if(file.Length>0)
            {
                using(var stram =file.OpenReadStream())
                {
                    var photoParams=new ImageUploadParams()
                    {
                        File=new FileDescription(file.Name,stram),
                        Transformation=new Transformation().Width(500).Height(500)
                        .Crop("fill").Gravity("face")
                    };

                    uploadResult=_Cloudinary.Upload(photoParams);
                }
            }

            PhotoForCreationDto.Url=uploadResult.Uri.ToString();
            PhotoForCreationDto.PublicId=uploadResult.PublicId;

            var photo=_mapper.Map<Photo>(PhotoForCreationDto);
            
            if(!UserFromRepo.Photos.Any(x=>x.IsMain==true))
                photo.IsMain=true;

            UserFromRepo.Photos.Add(photo);
            
            if(await _repo.SaveAll())
            {
                //return Ok();
                var PhotoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto",new {id=photo.Id},PhotoToReturn);
            }
                

            return BadRequest("Couldn't add new photo");

        }
       
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId,int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo=await _repo.GetUser(userId);
            if(!userFromRepo.Photos.Any(x=>x.Id==id))
                return Unauthorized();
            
            var photoFromRepo = await _repo.GetPhoto(id);
            if(photoFromRepo.IsMain)
                return BadRequest("this is already the main photo");
            
            var CurrentlyMainPhoto=await _repo.getUserMainPhoto(userId);
            if(CurrentlyMainPhoto!=null)
                CurrentlyMainPhoto.IsMain=false;

            photoFromRepo.IsMain=true;

            if(await _repo.SaveAll())
                return NoContent();

            return BadRequest("couldn't set photo to main");

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId,int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                 return Unauthorized();

            var userFromRepo=await _repo.GetUser(userId);
            if(!userFromRepo.Photos.Any(x=>x.Id==id))
                 return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);
            if(photoFromRepo.IsMain)
                return BadRequest("You can not delete your main photo!");

            if(photoFromRepo.PublicId!=null){
                var DeleteParams=new DeletionParams(photoFromRepo.PublicId);
                var result=_Cloudinary.Destroy(DeleteParams);
                if(result.Result=="ok"){
                    _repo.Delete(photoFromRepo);
                }
            }
            else{
                _repo.Delete(photoFromRepo);
            }
        
            if(await _repo.SaveAll())
                return Ok();

            return BadRequest("failed to delete selected photo");
        }   
    }
}


