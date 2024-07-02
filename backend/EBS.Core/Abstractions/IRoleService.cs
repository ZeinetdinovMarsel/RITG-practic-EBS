using EBS.Core.Enums;

namespace EBS.Core.Abstractions;
public interface IRoleService
{
    Task<List<Role>> GetRolesAsync(int userId);
}
