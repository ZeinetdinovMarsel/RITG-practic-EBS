using EBS.Core.Enums;
using EBS.Core.Models;

namespace EBS.Core.Abstractions;
public interface IUsersRepository
{
    Task<UserModel> Add(UserModel user);
    Task<int> Delete(int id);
    Task<int> Update(int id, UserModel user, int role);
    Task<UserModel> GetByEmail(string email);
    Task<UserModel> GetById(int Id);
    Task<HashSet<Permission>> GetUserPermissions(int userId);
    Task<List<Role>> GetUserRoles(int userId);
    Task<List<UserModel>> GetUsers();
    Task<List<UserModel>> GetUsersByRole(int role);
   
}
