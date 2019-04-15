using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _Datecontext;
        public ValuesController(DataContext context)
        {
            _Datecontext=context;
        }
        // GET api/values
        [HttpGet]
        public async Task<IActionResult > GetValues()
        {
            var Values =await _Datecontext.Values.ToListAsync();
            return Ok(Values);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult>  GetValue(int id)
        {
            var Values =await _Datecontext.Values.Where(x=>x.Id==id).ToListAsync();
            return Ok(Values);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
            
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
