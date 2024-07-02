using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using EBS.DataAccess.Entities;

namespace EBS.DataAccess.Configurations;
public partial class UserConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id).ValueGeneratedOnAdd();
        builder.Property(u => u.Username).IsRequired();
        builder.Property(u => u.Email).IsRequired();
        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.UpdatedAt).IsRequired();
        builder.Property(u => u.IsAdmin);

        builder.HasMany(u => u.Bookings)
                .WithOne()
                .HasForeignKey(b => b.UserId);

        builder.HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity<UserRoleEntity>(
            l => l.HasOne<RoleEntity>().WithMany().HasForeignKey(r => r.RoleId),
            r => r.HasOne<UserEntity>().WithMany().HasForeignKey(u => u.UserId));
    }

}
