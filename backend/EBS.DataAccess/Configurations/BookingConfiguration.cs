using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.Data;
using EBS.DataAccess.Entities;
using EBS.Core.Enums;

namespace EBS.DataAccess.Configurations;
public partial class BookingConfiguration : IEntityTypeConfiguration<BookingEntity>
{
    public void Configure(EntityTypeBuilder<BookingEntity> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).ValueGeneratedOnAdd();
        builder.Property(p => p.EventId).IsRequired();
        builder.Property(p => p.UserId).IsRequired();
        builder.Property(p => p.BookingDate).IsRequired();
        builder.Property(p => p.CreatedAt).IsRequired();
        builder.Property(p => p.UpdatedAt).IsRequired();
        builder.Property(p => p.HasAttended).IsRequired();
        builder.Property(p => p.IsCancelled).IsRequired();

        builder.HasOne(p => p.Event)
            .WithMany(e => e.Bookings)
            .HasForeignKey(p => p.EventId)
            .IsRequired();

        builder.HasOne(p => p.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(p => p.UserId)
            .IsRequired();
    }
}

