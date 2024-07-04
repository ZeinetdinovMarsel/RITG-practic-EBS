using EBS.Core.Abstractions;
using EBS.Core.Enums;
using EBS.Core.Models;

namespace EBS.Application.Services;
public class UsersService : IUsersService
{
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUsersRepository _usersRepository;
    private readonly IJwtProvider _jwtProvider;

    public UsersService(IUsersRepository usersRepository,
                        IPasswordHasher passwordHasher,
                        IJwtProvider jwtProvider)
    {
        _usersRepository = usersRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<int> Register(UserModel user)
    {
        var existingUser = await _usersRepository.GetByEmail(user.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Почта уже занята");
        }

        var hashedPassword = _passwordHasher.Generate(user.PasswordHash);

        user.PasswordHash = hashedPassword;

        user = await _usersRepository.Add(user);

        return user.Id;
    }

    public async Task<string> Login(string email, string password)
    {
        var user = await _usersRepository.GetByEmail(email);

        if (user == null)
        {
            throw new Exception("Пользователь не найден");
        }
        var result = _passwordHasher.Verify(password, user.PasswordHash);

        if (!result)
        {
            throw new Exception("Не правильный пароль");
        }


        var token = _jwtProvider.GenerateToken(user);
        return token;
    }

    public async Task<int> UpdateUserAsync(int id, bool isAdmin, UserModel user, string oldPassword)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(UserModel));
        }
        var existingUser = await _usersRepository.GetByEmail(user.Email);
        if (existingUser != null && id != existingUser.Id && existingUser.Id != id)
        {
            throw new InvalidOperationException("Почта уже занята");
        }
        if (_usersRepository.GetById(id) == null)
        {
            throw new InvalidOperationException("Пользователя не существует");
        }

        if (isAdmin)
        {
            var hashedPassword = _passwordHasher.Generate(user.PasswordHash);
            if (existingUser.PasswordHash != hashedPassword && existingUser.PasswordHash != user.PasswordHash)
                user.PasswordHash = hashedPassword;
        }
        else if (_passwordHasher.Verify(oldPassword, existingUser.PasswordHash))
        {
            var hashedPassword = _passwordHasher.Generate(user.PasswordHash);
            if (existingUser.PasswordHash != hashedPassword)
                user.PasswordHash = hashedPassword;
        }
        else
        {
            throw new InvalidOperationException("Не правильный пароль");
        }
        int role = user.IsAdmin ? 1 : 2;

        return await _usersRepository.Update(id, user, role);
    }

    public async Task<int> DeleteUserAsync(int id)
    {
        var user = await _usersRepository.GetById(id);
        if (user == null)
        {
            throw new InvalidOperationException("Пользователя не существует");
        }
        return await _usersRepository.Delete(id);
    }
    public async Task<UserModel> GetUserFromToken(string token)
    {
        int userId = _jwtProvider.ValidateToken(token);

        var user = await _usersRepository.GetById(userId);

        return user;
    }

    public async Task<List<UserModel>> GetAllUsersByRole(int role)
    {
        return await _usersRepository.GetUsersByRole(role);
    }

    public async Task<List<UserModel>> GetAllUsers()
    {
        return await _usersRepository.GetUsers();
    }
    public async Task<Role> GetUserRole(int id)
    {
        return (await _usersRepository.GetUserRoles(id))[0];
    }
}