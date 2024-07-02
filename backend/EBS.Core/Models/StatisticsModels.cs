namespace EBS.Core.Models
{
    public class BookingStatistics
    {
        public int TotalBookings { get; set; }
        public Dictionary<int, int> BookingsByEvent { get; set; }
        public List<BookingTrendModel> BookingTrends { get; set; }
        public int UniqueUsersCount { get; set; }
        public BookingCancellationStatsModel CancellationStats { get; set; }
        public List<EventModel> PopularEvents { get; set; }
    }

    public class EventStatisticsModel
    {
        public int BookingCount { get; set; }
        public int AttendeeCount { get; set; }
    }

    public class PopularEventModel
    {
        public int EventId { get; set; }
        public string Title { get; set; }
        public int BookingCount { get; set; }
    }

    public class BookingTrendModel
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }

    public class BookingCancellationStatsModel
    {
        public int TotalBookings { get; set; }
        public object CancelledBookings { get; set; }
        public object CancellationRate { get; set; }
    }
    public class AttendanceStatistics
    {
        public int TotalAttendees { get; set; }
        public Dictionary<int, int> AttendeesByEvent { get; set; }
        public Dictionary<int, double> AttendanceRateByEvent { get; set; }
        public int RepeatAttendeesCount { get; set; }
        public List<UserModel> AttendeesProfiles { get; set; }
    }
}
