using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _dbcontext;
        public DatingRepository(DataContext dbcontext)
        {
            this._dbcontext = dbcontext;

        }
        public void Add<T>(T entity) where T : class
        {
            _dbcontext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbcontext.Remove(entity);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo= await _dbcontext.Photos.FirstOrDefaultAsync(x=>x.Id==id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            return await _dbcontext.Users.Include(x=>x.Photos).Where(a=>a.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Photo> getUserMainPhoto(int userid)
        {
            return await _dbcontext.Photos.Where(x=>x.UserId==userid).FirstOrDefaultAsync(x=>x.IsMain);
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _dbcontext.Users.Include(x=>x.Photos).ToListAsync();
        }

        public async Task<bool> SaveAll()
        {
            return await _dbcontext.SaveChangesAsync() > 0;
        }
    }
}