using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using persona_backend.Data;
using persona_backend.Logic;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
namespace persona_backend.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly ClienteService _clienteService;

        public ClientesController(ClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return Ok(await _clienteService.GetClientes());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _clienteService.GetCliente(id);
            if (cliente == null)
            {
                return NotFound();
            }
            return Ok(cliente);
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            var nuevoCliente = await _clienteService.CreateCliente(cliente);
            return CreatedAtAction(nameof(GetCliente), new { id = nuevoCliente.Id }, nuevoCliente);
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            var resultado = await _clienteService.UpdateCliente(id, cliente);
            if (!resultado)
            {
                return BadRequest();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var eliminado = await _clienteService.DeleteCliente(id);
            if (!eliminado)
            {
                return NotFound();
            }
            return NoContent();
        }
    }

}