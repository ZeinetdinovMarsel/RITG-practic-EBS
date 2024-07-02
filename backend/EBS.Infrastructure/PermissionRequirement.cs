using Microsoft.AspNetCore.Authorization;
using EBS.Core.Enums;

namespace EBS.Infrastructure;
public class PermissionRequirement(Permission[] permissions)
    : IAuthorizationRequirement
{
    public Permission[] Permissions { get; set; } = permissions;
}

