using EBS.Core.Models;

namespace EBS.Core.Abstractions;
public interface IStatisticsService
{
    Task<AttendanceStatistics> GenerateAttendanceStatisticsAsync();
    Task<BookingStatistics> GenerateBookingStatisticsAsync();
}