using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace NewhouseIT.BasketService.Baskets.Routes
{
   [Route("/api/ping")]
   public class HealthCheckController
    {
        [HttpGet] public IActionResult Get() => new OkObjectResult("Service is healthy");
    }
}
