using EBS.Core.Abstractions;
using EBS.Core.Models;

namespace EBS.Core.Abstractions;
public interface IBookingRepository
{
    Task<BookingModel> CreateBookingAsync(BookingModel bookingModel);
    Task<bool> DeleteBookingAsync(int bookingId);
    Task<List<BookingModel>> GetAllBookingsAsync();
    Task<double> GetAttendanceRateAsync(int eventId);
    Task<Dictionary<int, int>> GetAttendeesCountByEventAsync();
    Task<int> GetAttendeesCountForEventAsync(int eventId);
    Task<List<UserModel>> GetAttendeesProfilesAsync(int eventId);
    Task<BookingModel> GetBookingByIdAsync(int bookingId);
    Task<BookingModel> GetBookingByUserAndEventAsync(int userId, int eventId);
    Task<BookingCancellationStatsModel> GetBookingCancellationStatsAsync();
    Task<Dictionary<int, int>> GetBookingsCountByEventAsync();
    Task<List<BookingTrendModel>> GetBookingTrendsAsync(TrendPeriod period);
    Task<NoShowStatsModel> GetNoShowStatsAsync(int eventId);
    Task<List<EventModel>> GetPopularEventsAsync(int topCount);
    Task<List<EventModel>> GetPopularEventsByAttendanceAsync(int topCount);
    Task<int> GetRepeatAttendeesCountAsync(int eventId);
    Task<int> GetTotalAttendeesCountAsync();
    Task<int> GetTotalBookingsCountAsync();
    Task<int> GetUniqueBookingUsersCountAsync();
    Task<BookingModel> UpdateBookingAsync(int bookingId, BookingModel bookingModel);

}