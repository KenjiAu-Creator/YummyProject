using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Authentication
{
  public class Response
  {
    public string Status { get; set; }
    public string Message { get; set; }

    public List<string> ErrorList { get; set; }
  }
}
