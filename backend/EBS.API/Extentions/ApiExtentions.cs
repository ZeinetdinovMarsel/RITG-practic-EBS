using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EBS.API.Endpoints;
using EBS.Application;
using EBS.Core.Abstractions;
using EBS.Core.Enums;
using EBS.Infrastructure;
namespace EBS.API.Extentions;
public static class ApiExtentions
{
    public static void AddMappedEndpoints(
        this IEndpointRouteBuilder app)
    {
        app.MapStatisticsEndpoints();
        app.MapUsersEndpoints();
        app.MapEventsEndpoints();
        app.MapBookingsEndpoints();
    }

    public static void AddApiAuthentification(
        this IServiceCollection services,
        IOptions<JwtOptions> jwtOptions)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
        {
            options.TokenValidationParameters = new()
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtOptions.Value.SecretKey))
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["jwt"];
                    return Task.CompletedTask;
                }
            };
        });

        services.AddScoped<IPermissionService, PermissionService>();
        services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();

        services.AddScoped<IRoleService, RoleService>();
        services.AddSingleton<IAuthorizationHandler, RoleAuthorizationHandler>();
        services.AddAuthorization();
    }

    public static IEndpointConventionBuilder RequirePermissions<TBuilder>(
        this TBuilder builder, params Permission[] permissions)
        where TBuilder : IEndpointConventionBuilder
    {
        return builder.RequireAuthorization(policy =>
        policy.AddRequirements(new PermissionRequirement(permissions)));
    }

    public static IEndpointConventionBuilder RequireRoles<TBuilder>(
        this TBuilder builder, params Role[] roles)
        where TBuilder : IEndpointConventionBuilder
    {
        return builder.RequireAuthorization(policy =>
        policy.AddRequirements(new RoleRequirement(roles)));
    }
}

