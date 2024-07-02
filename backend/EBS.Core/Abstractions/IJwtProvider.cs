using EBS.Core.Models;

namespace EBS.Core.Abstractions;
public interface IJwtProvider
{
    string GenerateToken(UserModel user);
    int ValidateToken(string token);
}