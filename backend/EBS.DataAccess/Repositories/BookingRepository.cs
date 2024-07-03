using EBS.Core.Abstractions;
using EBS.Core.Models;
using EBS.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EBS.DataAccess.Repositories;
public class BookingRepository : IBookingRepository
{
    private readonly EBSDbContext _dbContext;

    public BookingRepository(EBSDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<BookingModel>> GetAllBookingsAsync(bool isAdmin)
    {

        if (isAdmin)
        {

            return await _dbContext.Bookings
                .Select(b => new BookingModel
                {
                    Id = b.Id,
                    EventId = b.EventId,
                    BookingDate = b.BookingDate,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    HasAttended = b.HasAttended,
                    IsCancelled = b.IsCancelled,
                })
                .ToListAsync();
        }
        else
        {
            return await _dbContext.Bookings
                .Select(b => new BookingModel
                {
                    Id = b.Id,
                    EventId = b.EventId,
                    UserId = b.UserId,
                    BookingDate = b.BookingDate,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    HasAttended = b.HasAttended,
                    IsCancelled = b.IsCancelled,
                })
                .ToListAsync();
        }
    }

    public async Task<BookingModel> GetBookingByIdAsync(int bookingId)
    {
        var bookingEntity = await _dbContext.Bookings.FindAsync(bookingId);

        if (bookingEntity == null)
            return null;

        return new BookingModel
        {
            Id = bookingEntity.Id,
            EventId = bookingEntity.EventId,
            UserId = bookingEntity.UserId,
            BookingDate = bookingEntity.BookingDate,
            CreatedAt = bookingEntity.CreatedAt,
            UpdatedAt = bookingEntity.UpdatedAt,
            HasAttended = bookingEntity.HasAttended,
            IsCancelled = bookingEntity.IsCancelled,
        };
    }

    public async Task<BookingModel> CreateBookingAsync(BookingModel bookingModel)
    {
        var eventEntity = _dbContext.Events.Find(bookingModel.EventId);
        var userEntity = _dbContext.Users.Find(bookingModel.UserId);

        var bookingEntity = new BookingEntity
        {
            EventId = bookingModel.EventId,
            UserId = bookingModel.UserId,
            BookingDate = bookingModel.BookingDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Event = eventEntity,
            User = userEntity
        };

        _dbContext.Bookings.Add(bookingEntity);
        await _dbContext.SaveChangesAsync();

        bookingModel.Id = bookingEntity.Id;
        bookingModel.CreatedAt = bookingEntity.CreatedAt;
        bookingModel.UpdatedAt = bookingEntity.UpdatedAt;

        return bookingModel;
    }

    public async Task<BookingModel> UpdateBookingAsync(int bookingId, BookingModel bookingModel)
    {
        var bookingEntity = await _dbContext.Bookings.FindAsync(bookingId);

        var eventEntity = _dbContext.Events.Find(bookingModel.EventId);
        var userEntity = _dbContext.Users.Find(bookingModel.UserId);

        if (bookingEntity == null)
            return null;

        bookingEntity.EventId = bookingModel.EventId;
        bookingEntity.UserId = bookingModel.UserId;
        bookingEntity.BookingDate = bookingModel.BookingDate;
        bookingEntity.UpdatedAt = DateTime.UtcNow;
        bookingEntity.HasAttended = bookingModel.HasAttended;
        bookingEntity.IsCancelled = bookingModel.IsCancelled;
        bookingEntity.Event = eventEntity;
        bookingEntity.User = userEntity;

        _dbContext.SaveChanges();

        return bookingModel;
    }

    public async Task<bool> DeleteBookingAsync(int bookingId)
    {
        var bookingEntity = await _dbContext.Bookings.FindAsync(bookingId);

        if (bookingEntity == null)
            return false;

        _dbContext.Bookings.Remove(bookingEntity);
        _dbContext.SaveChanges();

        return true;
    }

    public async Task<BookingModel> GetBookingByUserAndEventAsync(int userId, int eventId)
    {
        return await _dbContext.Bookings
            .Where(b => b.UserId == userId && b.EventId == eventId)
            .Select(b => new BookingModel
            {
                Id = b.Id,
                EventId = b.EventId,
                UserId = b.UserId,
                BookingDate = b.BookingDate,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
                HasAttended = b.HasAttended,
                IsCancelled = b.IsCancelled,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<int> GetAttendeesCountForEventAsync(int eventId)
    {
        return await _dbContext.Bookings
            .CountAsync(b => b.EventId == eventId);
    }
    public async Task<int> GetTotalBookingsCountAsync()
    {
        return await _dbContext.Bookings.CountAsync();
    }

    public async Task<Dictionary<int, int>> GetBookingsCountByEventAsync()
    {
        return await _dbContext.Bookings
            .GroupBy(b => b.EventId)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }
    public async Task<List<BookingTrendModel>> GetBookingTrendsAsync(TrendPeriod period)
    {
        var startDate = DateTime.UtcNow.AddMonths(-1);
        var endDate = DateTime.UtcNow;

        return await _dbContext.Bookings
            .Where(b => b.BookingDate >= startDate && b.BookingDate <= endDate)
            .GroupBy(b => b.BookingDate.Date)
            .Select(g => new BookingTrendModel
            {
                Date = g.Key,
                Count = g.Count()
            })
            .OrderBy(g => g.Date)
            .ToListAsync();
    }
    public async Task<int> GetUniqueBookingUsersCountAsync()
    {
        return await _dbContext.Bookings
            .Select(b => b.UserId)
            .Distinct()
            .CountAsync();
    }

    public async Task<BookingCancellationStatsModel> GetBookingCancellationStatsAsync()
    {
        var totalBookings = await _dbContext.Bookings.CountAsync();
        var cancelledBookings = await _dbContext.Bookings
            .CountAsync(b => b.IsCancelled);

        var cancellationRate = totalBookings > 0 ? (double)cancelledBookings / totalBookings : 0.0;

        return new BookingCancellationStatsModel
        {
            TotalBookings = totalBookings,
            CancelledBookings = cancelledBookings,
            CancellationRate = cancellationRate
        };
    }

    public async Task<List<EventModel>> GetPopularEventsAsync(int topCount)
    {
        return await _dbContext.Events
            .OrderByDescending(e => e.Bookings.Count())
            .Take(topCount)
            .Select(e => new EventModel
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Location = e.Location,
                Date = e.Date,
                MaxAttendees = e.MaxAttendees,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .ToListAsync();
    }
    public async Task<int> GetTotalAttendeesCountAsync()
    {
        return await _dbContext.Bookings
            .Where(b => b.HasAttended)
            .CountAsync();
    }

    public async Task<Dictionary<int, int>> GetAttendeesCountByEventAsync()
    {
        return await _dbContext.Bookings
            .Where(b => b.HasAttended)
            .GroupBy(b => b.EventId)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }

    public async Task<double> GetAttendanceRateAsync(int eventId)
    {
        var totalBookings = await _dbContext.Bookings
            .CountAsync(b => b.EventId == eventId);

        if (totalBookings == 0)
            return 0.0;

        var attendedBookings = await _dbContext.Bookings
            .CountAsync(b => b.EventId == eventId && b.HasAttended);

        return (double)attendedBookings / totalBookings;
    }
    public async Task<int> GetRepeatAttendeesCountAsync(int eventId)
    {
        var repeatAttendees = await _dbContext.Bookings
            .Where(b => b.EventId == eventId)
            .GroupBy(b => b.UserId)
            .CountAsync(g => g.Count() > 1);

        return repeatAttendees;
    }
    public async Task<List<UserModel>> GetAttendeesProfilesAsync(int eventId)
    {
        return await _dbContext.Bookings
            .Where(b => b.EventId == eventId && b.HasAttended)
            .Select(b => b.User)
            .Select(u => new UserModel
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            })
            .ToListAsync();
    }
    public async Task<NoShowStatsModel> GetNoShowStatsAsync(int eventId)
    {
        var totalBookings = await _dbContext.Bookings
            .CountAsync(b => b.EventId == eventId);

        var attendedBookings = await _dbContext.Bookings
            .CountAsync(b => b.EventId == eventId && b.HasAttended);

        var noShowsCount = totalBookings - attendedBookings;
        var noShowsRate = totalBookings > 0 ? (double)noShowsCount / totalBookings : 0.0;

        return new NoShowStatsModel
        {
            TotalBookings = totalBookings,
            NoShowsCount = noShowsCount,
            NoShowsRate = noShowsRate
        };
    }
    public async Task<List<EventModel>> GetPopularEventsByAttendanceAsync(int topCount)
    {
        return await _dbContext.Events
            .OrderByDescending(e => e.Bookings.Count(b => b.HasAttended))
            .Take(topCount)
            .Select(e => new EventModel
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Location = e.Location,
                Date = e.Date,
                MaxAttendees = e.MaxAttendees,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .ToListAsync();
    }
}


