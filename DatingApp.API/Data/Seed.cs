using System.Collections.Generic;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _dbcontext;
        
        public Seed(DataContext dbcontext)
        {
            this._dbcontext = dbcontext;
            
        }
        public async void SeedUsers()
        {
            var UsersData=System.IO.File.ReadAllText("Data/UserSeedData.json");
            var Users= JsonConvert.DeserializeObject<List<User>>(UsersData) ;
            foreach (var user in Users)
            {
                byte[] PasswordHash, PasswordSalt;
                CreatePasswordHash("password",out PasswordHash,out PasswordSalt);
                user.PasswordHash=PasswordHash;
                user.PasswordSalt=PasswordSalt;

                user.Username=user.Username.ToLower();


                 _dbcontext.Users.Add(user);
                 _dbcontext.SaveChanges();
                //AuthRepository repo =new AuthRepository(_dbcontext);
                //await repo.Register(user,"password") ;
            }
            
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac =new System.Security.Cryptography.HMACSHA512()){
                passwordSalt=hmac.Key;
                passwordHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}