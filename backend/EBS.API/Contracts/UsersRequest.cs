using System.ComponentModel.DataAnnotations;

namespace EBS.API.Contracts;
public record UsersRequest
(
    [Required] int UserId,
    [Required] string name
);

public record UsersAdminResponse
(
    [Required] int UserId,
    [Required] string Username,
    [Required] string Password,
    [Required] string Email,
    [Required] bool IsAdmin,
    [Required] DateTime CreatedAt,
    [Required] DateTime UpdatedAt
);

public record UsersAdminRequest
(
    int UserId,
    [Required] string Username,
    string oldPassword,
    string Password,
    [Required] string Email,
    bool IsAdmin
);
