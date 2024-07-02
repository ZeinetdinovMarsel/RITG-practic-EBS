using EBS.Core.Models;

namespace EBS.Core.Abstractions;
public interface IBookingService
{
    Task<BookingModel> CreateBookingAsync(BookingModel bookingModel);
    Task<bool> DeleteBookingAsync(int bookingId);
    Task<List<BookingModel>> GetAllBookingsAsync();
    Task<BookingModel> GetBookingByIdAsync(int bookingId);
    Task<BookingModel> UpdateBookingAsync(int bookingId, BookingModel bookingModel);

}
