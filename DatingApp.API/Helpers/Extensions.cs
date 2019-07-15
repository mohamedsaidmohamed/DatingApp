using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response ,string message){
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");

        }
        public static void AddPagaination(this HttpResponse response,int currentPage,int ItemsPerPage,int totalItems,int totalPages){

            var pagainationHeader=new PagainationHeader(currentPage,ItemsPerPage,totalItems,totalPages);
            
            var CamelCaseFormatter = new JsonSerializerSettings();
            CamelCaseFormatter.ContractResolver=new CamelCasePropertyNamesContractResolver();

            response.Headers.Add("Pagaination",JsonConvert.SerializeObject(pagainationHeader,CamelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers","Pagaination");
        }

        public static int CalculateAge(this DateTime  TheDateTime){

            var age=DateTime.Today.Year-TheDateTime.Year;
            if(TheDateTime.AddYears(age)>DateTime.Today)
                age--;

            return age;
        }
    }
}