using EBS.API.Contracts;
using EBS.API.Extentions;
using EBS.Application.Services;
using EBS.Core.Enums;
using EBS.Core.Models;

namespace EBS.API.Endpoints;
public static class UsersEndpoints
{
    public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/user/register", Register);
        app.MapPost("/user/login", Login);
        app.MapPost("/user/logout", Logout).RequireAuthorization();
        app.MapGet("/user/profile", GetUserDetails).RequireAuthorization();
        app.MapPut("/user/profile/update", UpdateUser).RequireAuthorization();
        app.MapDelete("/user/profile/delete", DeleteUser).RequireRoles(Role.Admin);
        app.MapGet("/users/role/all/", GetUsersByRole).RequireAuthorization();
        app.MapGet("/user/profile/role", GetUserRole).RequireAuthorization();

        return app;
    }
    private static async Task<IResult> Register(
        RegisterUserRequest request,
        UsersService usersService)
    {
        try
        {
            UserModel user = new UserModel()
            {
                Username = request.Username,
                PasswordHash = request.Password,
                Email = request.Email,
                IsAdmin = false,
                CreatedAt = DateTime.UtcNow
            };
            var userId = await usersService.Register(user);

            return Results.Ok(userId);
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> Login(
        LoginUserRequest request,
        UsersService usersService,
        HttpContext context)
    {
        try
        {
            var token = await usersService.Login(request.Email, request.Password);
            context.Response.Cookies.Append("jwt", token);
            return Results.Ok(token);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static IResult Logout(HttpContext context)
    {
        try
        {
            context.Response.Cookies.Delete("jwt");
            return Results.Ok("Вы успешно вышли");
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> GetUserDetails(
        UsersService usersService,
        HttpContext context)
    {
        try
        {
            var token = context.Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(token))
                return Results.BadRequest(new { Message = "Вы не авторизованы" });

            var user = await usersService.GetUserFromToken(token);
            if (user == null)
                return Results.NotFound(new { Message = "Пользователь не найден" });

            return Results.Ok(user);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }
    private static async Task<IResult> UpdateUser(
       UsersService userService,
       UsersAdminRequest request)
    {
        try
        {
            UserModel usr = new UserModel()
            {
                Id = request.UserId,
                Username = request.Username,
                PasswordHash = request.Password,
                Email = request.Email,
                IsAdmin = request.IsAdmin,
                UpdatedAt = DateTime.UtcNow,
            };

            var userId = await userService.UpdateUserAsync(request.UserId, usr);

            return Results.Ok(userId);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> DeleteUser(
        UsersService userService,
        int id)
    {
        try
        {
            await userService.DeleteUserAsync(id);
            return Results.Ok();
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }

    }
    private static async Task<IResult> GetUsersByRole(
      int roleId,
       UsersService usersService)
    {
        var users = await usersService.GetAllUsersByRole(roleId);

        var response = users.Select(u => new UsersAdminResponse(
            u.Id,
            u.Username,
            u.PasswordHash,
            u.Email,
            u.IsAdmin,
            u.CreatedAt,
            u.UpdatedAt));

        return Results.Ok(response);
    }

    private static async Task<IResult> GetUserRole(
      UsersService usersService,
        HttpContext context)
    {
        var token = context.Request.Cookies["jwt"];

        var user = await usersService.GetUserFromToken(token);

        var role = await usersService.GetUserRole(user.Id);

        return Results.Ok(role);
    }
}