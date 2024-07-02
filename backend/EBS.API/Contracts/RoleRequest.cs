using System.ComponentModel.DataAnnotations;

namespace EBS.API.Contracts;
    public record RoleRequest
    ([Required] int role);
