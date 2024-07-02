using System.ComponentModel.DataAnnotations;

namespace EBS.API.Contracts;
public record RegisterUserRequest
(
    [Required] string Username,
    [Required] string Password,
    [Required] string Email
);

