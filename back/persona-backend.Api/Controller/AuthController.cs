using Microsoft.AspNetCore.Mvc;
using persona_backend.Data.Usuario;

namespace persona_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IJwtService _jwtService;

        public AuthController(IAuthService authService, IJwtService jwtService)
        {
            _authService = authService;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var response = _authService.ProcessLogin(request);
            if (response == null)
            {
                return Unauthorized("Usuario o contraseña incorrectos");
            }

            return Ok(response);
        }
    }
}
