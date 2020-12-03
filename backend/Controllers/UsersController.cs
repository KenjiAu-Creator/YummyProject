using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{

  [ApiController]
  [Route("api/[controller]")]
  public class UsersController : ControllerBase
  {

    private readonly DBContext _context;

    public UsersController(DBContext context)
    {
      _context = context;
    }

    // GET: api/users/{id}
    [Authorize]
    [HttpGet]
    [Route("{id:length(8,50):required}")]
    public ActionResult<User> GetUserById(string id)
    {
      // Users ID is a GUID string.
      var result = _context.Users
                    .Where(x => x.Id == id)
                    .Select(x => new { Id = x.Id, name = x.Name, email = x.Email })
                    .SingleOrDefault();

      if (result == null)
      {
        return NotFound();
      }

      return Ok(result);
    }
  }
}
