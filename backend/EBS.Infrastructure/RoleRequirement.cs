using Microsoft.AspNetCore.Authorization;
using EBS.Core.Enums;

namespace EBS.Infrastructure;
public class RoleRequirement(Role[] roles)
    : IAuthorizationRequirement
{
    public Role[] Roles { get; set; } = roles;
}

