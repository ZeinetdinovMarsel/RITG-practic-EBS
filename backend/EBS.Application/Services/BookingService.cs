using EBS.Core.Abstractions;
using EBS.Core.Models;

namespace EBS.Application.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IEventRepository _eventRepository;
    private readonly IUsersRepository _userRepository;
    public BookingService(IBookingRepository bookingRepository, IEventRepository eventRepository, IUsersRepository usersRepository)
    {
        _bookingRepository = bookingRepository;
        _eventRepository = eventRepository;
        _userRepository = usersRepository;
    }

    public async Task<List<BookingModel>> GetAllBookingsAsync(int userId)
    {
        var user = await _userRepository.GetById(userId);
        bool isAdmin = user.IsAdmin;
        
        return await _bookingRepository.GetAllBookingsAsync(isAdmin, userId);
    }

    public Task<BookingModel> GetBookingByIdAsync(int bookingId)
    {
        return _bookingRepository.GetBookingByIdAsync(bookingId);
    }

    public async Task<BookingModel> CreateBookingAsync(BookingModel bookingModel)
    {
        var existingBooking = await _bookingRepository.GetBookingByUserAndEventAsync(bookingModel.UserId, bookingModel.EventId);

        if (existingBooking != null && (!existingBooking.HasAttended && !existingBooking.IsCancelled))
        {
            throw new Exception("Данный пользователь уже забронировал место.");
        }

        var eventModel = await _eventRepository.GetEventByIdAsync(bookingModel.EventId);
        if (eventModel == null)
        {
            throw new Exception("Мероприятия не сущесвтует");
        }

        var currentAttendeesCount = await _bookingRepository.GetAttendeesCountForEventAsync(bookingModel.EventId);
        if (currentAttendeesCount >= eventModel.MaxAttendees)
        {
            throw new Exception("На мероприятии мест больше нет");
        }

        return await _bookingRepository.CreateBookingAsync(bookingModel);
    }


    public Task<BookingModel> UpdateBookingAsync(int bookingId, BookingModel bookingModel)
    {
        return _bookingRepository.UpdateBookingAsync(bookingId, bookingModel);
    }

    public Task<bool> DeleteBookingAsync(int bookingId)
    {
        return _bookingRepository.DeleteBookingAsync(bookingId);
    }
}
