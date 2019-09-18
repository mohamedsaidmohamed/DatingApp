using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
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

        public async Task<Like> GetLike(int userId, int recipiantId)
        {
            return await _dbcontext.Likes
            .FirstOrDefaultAsync(x=>x.LikerId==userId && x.LikeeId==recipiantId);
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

        public async Task<PagedList<User>> GetUsers(UserParams userparams)
        {
            var usersQuery=_dbcontext.Users.Include(x=>x.Photos).OrderByDescending(x=>x.LastActive).AsQueryable();
            
            usersQuery = usersQuery.Where(x=>x.Id != userparams.UserId);
            usersQuery = usersQuery.Where(x=>x.Gender==userparams.Gender);

            if(userparams.likers){
                var userlikers=await GetUserLikes(userparams.UserId,userparams.likers);
                usersQuery =usersQuery.Where(x=>userlikers.Contains(x.Id));
            }

            if(userparams.likes){
                var userlikees=await GetUserLikes(userparams.UserId,userparams.likers);
                usersQuery =usersQuery.Where(x=>userlikees.Contains(x.Id));
            }

            if(userparams.MinAge !=18 || userparams.MaxAge !=99)
            {
                var MinDOB = System.DateTime.Now.AddYears(-userparams.MaxAge - 1);
                var MaxDOB = System.DateTime.Now.AddYears(-userparams.MinAge);

                usersQuery =usersQuery.Where(x=>x.DateOfBirth >= MinDOB && x.DateOfBirth <= MaxDOB);
            }

            if(!string.IsNullOrEmpty(userparams.OrderBy) )
            {
                switch(userparams.OrderBy)
                {
                    case "created":
                        usersQuery=usersQuery.OrderByDescending(x=>x.Created);
                        break;
                    default:
                        usersQuery=usersQuery.OrderByDescending(x=>x.LastActive);
                    break;
                }
                
            }
            
            return await PagedList<User>.CreateAsync(usersQuery,userparams.PageSize,userparams.PageNumber);
        }
        public async Task<IEnumerable<int>> GetUserLikes(int id,bool likers){

                var user= await _dbcontext.Users
                                   .Include(x=>x.Likers)
                                   .Include(x=>x.Likees)
                                   .FirstOrDefaultAsync(x=>x.Id==id);


                if(likers){
                   return user.Likers.Where(x=>x.LikeeId==id).Select(x=>x.LikerId);

                }else{

                    return user.Likees.Where(x=>x.LikerId==id).Select(x=>x.LikeeId);
                }

        }

        public async Task<bool> SaveAll()
        {
            return await _dbcontext.SaveChangesAsync() > 0;
        }
    }
}