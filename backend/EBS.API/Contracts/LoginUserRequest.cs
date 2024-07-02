using System.ComponentModel.DataAnnotations;

namespace EBS.API.Contracts;
public record LoginUserRequest
(
    [Required] string Email,
    [Required] string Password);
