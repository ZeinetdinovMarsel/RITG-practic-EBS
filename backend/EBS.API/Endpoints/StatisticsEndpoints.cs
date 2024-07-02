using EBS.Core.Enums;
using EBS.API.Extentions;
using EBS.Services;

namespace EBS.API.Endpoints
{
    public static class StatisticsEndpoints
    {
        public static IEndpointRouteBuilder MapStatisticsEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/statistics/bookings", GetAllBookingsStatistics).RequirePermissions(Permission.Read);
            app.MapGet("/api/statistics/attendance", GetAttendanceStatistics).RequirePermissions(Permission.Read);

            return app;
        }

        private static async Task<IResult> GetAllBookingsStatistics(StatisticsService statisticsService)
        {
            try
            {
                var bookingStats = await statisticsService.GenerateBookingStatisticsAsync();
                return Results.Ok(bookingStats);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        }

        private static async Task<IResult> GetAttendanceStatistics(StatisticsService statisticsService)
        {
            try
            {
                var attendanceStats = await statisticsService.GenerateAttendanceStatisticsAsync();
                return Results.Ok(attendanceStats);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        }
    }
}
