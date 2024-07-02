using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.Data;
using EBS.DataAccess.Entities;
using EBS.Core.Enums;

namespace EBS.DataAccess.Configurations;
public partial class EventConfiguration : IEntityTypeConfiguration<EventEntity>
{
    public void Configure(EntityTypeBuilder<EventEntity> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).ValueGeneratedOnAdd();
        builder.Property(p => p.Title).IsRequired();
        builder.Property(p => p.Description).IsRequired();
        builder.Property(p => p.Location).IsRequired();
        builder.Property(p => p.Date).IsRequired();
        builder.Property(p => p.MaxAttendees).IsRequired();
        builder.Property(p => p.CreatedAt).IsRequired();
        builder.Property(p => p.UpdatedAt).IsRequired();


        builder.HasMany(e => e.Bookings)
                .WithOne()
                .HasForeignKey(b => b.EventId);
    }
}

