using Microsoft.EntityFrameworkCore;
using EBS.DataAccess.Entities;
using Microsoft.Extensions.Options;
using EBS.DataAccess.Configurations;
namespace EBS.DataAccess;
public class EBSDbContext(
    DbContextOptions<EBSDbContext> options,
    IOptions<AuthorizationOptions> authOptions) : DbContext(options)
{
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<RoleEntity> Roles { get; set; }
    public DbSet<UserRoleEntity> UserRoleEntity { get; set; }
    public DbSet<BookingEntity> Bookings { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EBSDbContext).Assembly);

        modelBuilder.ApplyConfiguration(new RolePermissionConfiguration(authOptions.Value));

    }
}
