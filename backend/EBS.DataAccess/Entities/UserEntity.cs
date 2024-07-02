namespace EBS.DataAccess.Entities;
public class UserEntity
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsAdmin { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<RoleEntity> Roles { get; set; } = [];
    public virtual ICollection<BookingEntity> Bookings { get; set; }
}