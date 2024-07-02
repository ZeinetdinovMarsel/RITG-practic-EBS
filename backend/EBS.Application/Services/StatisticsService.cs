using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EBS.Core.Abstractions;
using EBS.Core.Models;

namespace EBS.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IUsersRepository _usersRepository;

        public StatisticsService(
            IBookingRepository bookingRepository,
            IEventRepository eventRepository,
            IUsersRepository usersRepository)
        {
            _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
            _eventRepository = eventRepository ?? throw new ArgumentNullException(nameof(eventRepository));
            _usersRepository = usersRepository ?? throw new ArgumentNullException(nameof(usersRepository));
        }

        public async Task<BookingStatistics> GenerateBookingStatisticsAsync()
        {
            var bookingStats = new BookingStatistics();

            bookingStats.TotalBookings = await _bookingRepository.GetTotalBookingsCountAsync();
            bookingStats.BookingsByEvent = await _bookingRepository.GetBookingsCountByEventAsync();
            bookingStats.BookingTrends = await _bookingRepository.GetBookingTrendsAsync(TrendPeriod.Monthly);
            bookingStats.UniqueUsersCount = await _bookingRepository.GetUniqueBookingUsersCountAsync();
            bookingStats.CancellationStats = await _bookingRepository.GetBookingCancellationStatsAsync();
            bookingStats.PopularEvents = await _bookingRepository.GetPopularEventsAsync(topCount: 5);

            return bookingStats;
        }

        public async Task<AttendanceStatistics> GenerateAttendanceStatisticsAsync()
        {
            var attendanceStats = new AttendanceStatistics();

            attendanceStats.TotalAttendees = await _bookingRepository.GetTotalAttendeesCountAsync();
            attendanceStats.AttendeesByEvent = await _bookingRepository.GetAttendeesCountByEventAsync();
            var events = await _eventRepository.GetAllEventsAsync();
            attendanceStats.AttendanceRateByEvent = new Dictionary<int, double>();

            foreach (var e in events)
            {
                var attendanceRate = await _bookingRepository.GetAttendanceRateAsync(e.Id);
                attendanceStats.AttendanceRateByEvent.Add(e.Id, attendanceRate);
            }

            return attendanceStats;
        }
    }
}
