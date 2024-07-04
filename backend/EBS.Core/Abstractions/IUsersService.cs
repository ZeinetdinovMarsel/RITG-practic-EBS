using EBS.Core.Enums;
using EBS.Core.Models;

namespace EBS.Core.Abstractions;
public interface IUsersService
{
    Task<int> DeleteUserAsync(int id);
    Task<int> UpdateUserAsync(int id,bool isAdmin, UserModel user, string oldPassword);
    Task<List<UserModel>> GetAllUsers();
    Task<List<UserModel>> GetAllUsersByRole(int role);
    Task<UserModel> GetUserFromToken(string token);
    Task<Role> GetUserRole(int id);
    Task<string> Login(string email, string password);
    Task<int> Register(UserModel user);
    
}
