using EBS.Core.Models;
using EBS.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using EBS.Core.Abstractions;
using EBS.Core.Enums;
using System.Data;
namespace EBS.DataAccess.Repositories;
public class UsersRepository : IUsersRepository
{
    private readonly EBSDbContext _context;

    public UsersRepository(EBSDbContext context)
    {
        _context = context;
    }

    public async Task<UserModel> Add(UserModel user)
    {
        var role = user.IsAdmin ? 1 : 2;

        var roleEntity = await _context.Roles
            .SingleOrDefaultAsync(r => r.Id == role)
            ?? throw new InvalidOperationException("Роль не найдена");

        var userEntity = new UserEntity()
        {
            Id = user.Id,
            Username = user.Username,
            PasswordHash = user.PasswordHash,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = [roleEntity]
        };

        await _context.Users.AddAsync(userEntity);
        await _context.SaveChangesAsync();

        user = await GetByEmail(user.Email);
        return user;
    }
    public async Task<int> Update(int id, UserModel user, int role)
    {
        var newUserEntity = await _context.Users
        .SingleOrDefaultAsync(u => u.Id == user.Id)
        ?? throw new InvalidOperationException("Пользователь не найден");

        await _context.Users
            .Where(u => u.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(u => u.Username, u => user.Username)
                .SetProperty(u => u.Email, u => user.Email)
                .SetProperty(u => u.IsAdmin, u => user.IsAdmin)
                .SetProperty(u => u.UpdatedAt, u => user.UpdatedAt)
                .SetProperty(u => u.PasswordHash, u => user.PasswordHash));

        await _context.UserRoleEntity
            .Where(u => u.UserId == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(u => u.RoleId, u => (int)role));

        return id;
    }

    public async Task<int> Delete(int id)
    {
        var userEntity = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);

        await _context.Users
            .Where(u => u.Id == id)
            .ExecuteDeleteAsync();

        return id;
    }
    public async Task<UserModel> GetByEmail(string email)
    {
        var userEntity = await _context.Users
        .AsNoTracking()
        .FirstOrDefaultAsync(u => u.Email == email);

        if (userEntity == null) return null;

        UserModel user = new UserModel()
        {
            Id = userEntity.Id,
            Username = userEntity.Username,
            PasswordHash = userEntity.PasswordHash,
            Email = userEntity.Email,
            IsAdmin = userEntity.IsAdmin,
            CreatedAt = userEntity.CreatedAt,
            UpdatedAt = userEntity.UpdatedAt,
        };

        return user;
    }
    public async Task<UserModel> GetById(int Id)
    {
        var userEntity = await _context.Users
       .AsNoTracking()
       .FirstOrDefaultAsync(u => u.Id == Id);

        if (userEntity == null) return null;

        UserModel user = new UserModel()
        {
            Id = userEntity.Id,
            Username = userEntity.Username,
            PasswordHash = userEntity.PasswordHash,
            Email = userEntity.Email,
            IsAdmin = userEntity.IsAdmin,
            CreatedAt = userEntity.CreatedAt,
            UpdatedAt = userEntity.UpdatedAt,
        };

        return user;
    }

    public async Task<HashSet<Permission>> GetUserPermissions(int userId)
    {
        var roles = await _context.Users
            .AsNoTracking()
            .Include(u => u.Roles)
            .ThenInclude(r => r.Permissions)
            .Where(u => u.Id == userId)
            .Select(u => u.Roles)
            .ToArrayAsync();

        return roles
            .SelectMany(r => r)
            .SelectMany(r => r.Permissions)
            .Select(p => (Permission)p.Id)
            .ToHashSet();
    }

    public async Task<List<UserModel>> GetUsers()
    {
        var userEntitites = await _context.Users
            .AsNoTracking()
            .ToListAsync();

        List<UserModel> users = userEntitites.Select(userEntity => new UserModel()
        {
            Id = userEntity.Id,
            Username = userEntity.Username,
            PasswordHash = userEntity.PasswordHash,
            Email = userEntity.Email,
            IsAdmin = userEntity.IsAdmin,
            CreatedAt = userEntity.CreatedAt,
            UpdatedAt = userEntity.UpdatedAt,
        }).ToList();

        return users;
    }

    public async Task<List<UserModel>> GetUsersByRole(int role)
    {
        var userEntitites = await _context.Users
            .AsNoTracking()
            .Where(u => u.Roles.Any(r => r.Id == role))
            .ToListAsync();

        List<UserModel> users = userEntitites.Select(userEntity => new UserModel()
        {
            Id = userEntity.Id,
            Username = userEntity.Username,
            PasswordHash = userEntity.PasswordHash,
            Email = userEntity.Email,
            IsAdmin = userEntity.IsAdmin,
            CreatedAt = userEntity.CreatedAt,
            UpdatedAt = userEntity.UpdatedAt,
        }).ToList();

        return users;
    }

    public async Task<List<Role>> GetUserRoles(int userId)
    {
        var userRoles = await _context.Users
            .AsNoTracking()
            .Include(u => u.Roles)
            .Where(u => u.Id == userId)
            .SelectMany(u => u.Roles)
            .Select(r => Enum.Parse<Role>(r.Name))
            .ToListAsync();

        return userRoles;
    }
}