using EBS.Core.Enums;
using EBS.Core.Models;

namespace EBS.Core.Abstractions;
public interface IAdminRepository
{
    Task<int> Delete(int id);
    Task<int> Update(int id, UserModel tsk, int role);
}
