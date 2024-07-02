using System.ComponentModel.DataAnnotations;

namespace EBS.API.Contracts;
public record EventRequest
(
    [Required] string Title,
    [Required] string Description,
    [Required] string Location,
    [Required] DateTime Date,
    [Required] int MaxAttendees
);

public record EventResponse
(
    [Required] int Id,
    [Required] string Title,
    [Required] string Desciption,
    [Required] string Location,
    [Required] DateTime Date,
    [Required] int MaxAttendees,
    [Required] DateTime CreatedAt,
    [Required] DateTime UpdatedAt
);
