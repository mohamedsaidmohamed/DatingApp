using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _dbcontext;
        public AuthRepository(DataContext dbContext)
        {
            _dbcontext=dbContext;
        }
        
        public async Task<User> Login(string username, string password)
        {
            var user=await _dbcontext.Users.FirstOrDefaultAsync(x=>x.Username==username);
            if (user ==null)
                return null;
            
            if(!VerifyPasswordHash(password,user.PasswordHash,user.PasswordSalt))
                return null;

            return user;
        }

       

        public async Task<User> Register(User user, string password)
        {
            byte[] PasswordHash, PasswordSalt;
            CreatePasswordHash(password, out PasswordHash, out PasswordSalt);
            user.PasswordHash = PasswordHash;
            user.PasswordSalt = PasswordSalt;
            
            await _dbcontext.Users.AddAsync(user);
            try{
                await _dbcontext.SaveChangesAsync();
            }
            catch(Exception ex){
                
            }

            return user;    
        }

     
        public async Task<bool> UserExist(string username)
        {
            if(await _dbcontext.Users.AnyAsync(x=>x.Username == username))
                    return true;

            return false;
        }

        #region Helpers
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac =new System.Security.Cryptography.HMACSHA512()){
                passwordSalt=hmac.Key;
                passwordHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt)){

                var ComputeHash= hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for (int i = 0; i < ComputeHash.Length; i++)
                {
                    if(ComputeHash[i]!=passwordHash[i])
                        return false;   
                }

                return true;
            }
        }
        #endregion
    }
}