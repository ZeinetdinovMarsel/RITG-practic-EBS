using EBS.Core.Abstractions;
using EBS.Core.Enums;

namespace EBS.Application;
public class RoleService : IRoleService
{
    private readonly IUsersRepository _usersRepository;

    public RoleService(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }
    public Task<List<Role>> GetRolesAsync(int userId)
    {
        return _usersRepository.GetUserRoles(userId);
    }
}