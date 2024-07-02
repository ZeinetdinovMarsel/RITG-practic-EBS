using EBS.Core.Enums;

namespace EBS.Application;
public interface IPermissionService
{
    Task<HashSet<Permission>> GetPermissionsAsync(int userId);
}
