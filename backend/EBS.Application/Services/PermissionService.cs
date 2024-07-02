using EBS.Core.Abstractions;
using EBS.Core.Enums;

namespace EBS.Application;
public class PermissionService :  IPermissionService
{
    private readonly IUsersRepository _usersRepository;

    public PermissionService(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }
    public Task<HashSet<Permission>> GetPermissionsAsync(int userId)
    {
        return _usersRepository.GetUserPermissions(userId);
    }
}