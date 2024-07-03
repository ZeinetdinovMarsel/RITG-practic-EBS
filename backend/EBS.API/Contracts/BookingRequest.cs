using System.ComponentModel.DataAnnotations;

namespace EBS.API.Contracts;

public record BookingRequest
(
    int Id,
    int userId,
    DateTime BookingDate,
    [Required] bool HasAttended,
    [Required] bool IsCancelled
);
public record BookingResponse
(
    [Required] int Id,
    [Required] int EventId,
    [Required] int userId,
    [Required] DateTime BookingDate,
    [Required] DateTime CreatedAt,
    [Required] DateTime UpdatedAt,
    [Required] bool HasAttended,
    [Required] bool IsCancelled
);
