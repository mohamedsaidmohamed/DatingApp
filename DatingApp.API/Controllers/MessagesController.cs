
using System;
using System.Collections.Generic;
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
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize] 
    [Route("api/users/{userId}/[controller]")]
    //[Route("api/v{version:apiversion}/[controller]")]  
    [ApiController]
    public class MessagesController:ControllerBase{
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo,IMapper mapper)
        {
            _repo=repo;
            _mapper=mapper;
        }
        [HttpGet("{id}",Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId,int id){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var MessageFromRepo = await _repo.GetMessage(id);

            if(MessageFromRepo ==null)
                return NotFound();

           var MessageToReturn = _mapper.Map<MessageForCreationDto>(MessageFromRepo);

            return Ok(MessageToReturn);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId,[FromQuery]MessageParams messageparam){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageparam.UserId=userId;

            var MessagesFromRepo = await _repo.GetMessagesForUser(messageparam);

           var Messages = _mapper.Map<IEnumerable<MessageForReturnDto>>(MessagesFromRepo);

            Response.AddPagaination(MessagesFromRepo.CurrentPage,MessagesFromRepo.PageSize,MessagesFromRepo.TotalCount,MessagesFromRepo.TotalPages);

            return Ok(Messages);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessagesThread(int userId,int recipientId){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

           var MessagesFromRepo = await _repo.GetMessageThread(userId,recipientId);

           var Messages = _mapper.Map<IEnumerable<MessageForReturnDto>>(MessagesFromRepo);

            return Ok(Messages);
        }
        

        [HttpPost]
        public async Task<ActionResult> CreateMessage(int userId,MessageForCreationDto MessageForCreationDto)
        {

            var sender =await  _repo.GetUser(userId);

            if(sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                    return Unauthorized();

            MessageForCreationDto.SenderId=userId;

            var recipient=await _repo.GetUser(MessageForCreationDto.RecipientId);

            if(recipient==null)
                return BadRequest("couldn't find the user");

            var Message=_mapper.Map<Message>(MessageForCreationDto);

             _repo.Add(Message);

            if(await _repo.SaveAll())
            {
                var MessageToReturn = _mapper.Map<MessageForReturnDto>(Message);
                return CreatedAtRoute("GetMessage",new {id=Message.Id},MessageToReturn);
            }
            throw new Exception("Failed to create the message");
        } 

        [HttpPost]
        public async Task<ActionResult> DeleteMessage(int id,int userId){
            
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo=await _repo.GetMessage(id);
            
            if(messageFromRepo.SenderId==userId)
                messageFromRepo.SenderDeleted=true;
            
            if(messageFromRepo.RecipientId==userId)
                messageFromRepo.RecipientDeleted=true;
            
            if(messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
                _repo.Delete(messageFromRepo);

            if(await _repo.SaveAll())
                return NoContent();

            throw new Exception("can not delete this message!");
        }

        [HttpPost("{id}/read")]
        public async Task<ActionResult> MarkMessageAsRead(int id,int userId){
            
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo=await _repo.GetMessage(id);
            
            if(messageFromRepo.RecipientId != userId)
                    return Unauthorized();


            messageFromRepo.IsRead=true;
            messageFromRepo.DateRead=DateTime.Now;

            if(await _repo.SaveAll())
                return NoContent();

            throw new Exception("can not delete this message!");
        }


    }

}