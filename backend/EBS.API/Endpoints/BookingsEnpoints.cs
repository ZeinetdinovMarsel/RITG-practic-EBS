using EBS.Core.Models;
using EBS.API.Extentions;
using EBS.Core.Enums;
using EBS.Application.Services;
using EBS.API.Contracts;

namespace EBS.API.Endpoints;
public static class BookingsEndpoints
{
    public static IEndpointRouteBuilder MapBookingsEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/bookings", GetAllBookings).RequirePermissions(Permission.Read);
        app.MapGet("/bookings/{bookingId}", GetBookingById).RequirePermissions(Permission.Read);
        app.MapPost("/bookings", CreateBooking).RequirePermissions(Permission.Create);
        app.MapPut("/bookings/{bookingId}", UpdateBooking).RequirePermissions(Permission.Update);
        app.MapDelete("/bookings/{bookingId}", DeleteBooking).RequirePermissions(Permission.Delete);

        return app;
    }

    private static async Task<IResult> GetAllBookings(BookingService bookingService, HttpContext context, UsersService usersService)
    {
        UserModel user = await usersService.GetUserFromToken(context.Request.Cookies["jwt"]);
        var userId = user.Id;
        var bookings = await bookingService.GetAllBookingsAsync(userId);
        return Results.Ok(bookings);
    }

    private static async Task<IResult> GetBookingById(int bookingId, BookingService bookingService)
    {
        var booking = await bookingService.GetBookingByIdAsync(bookingId);

        if (booking == null)
            return Results.BadRequest(bookingId);

        return Results.Ok(booking);
    }

    private static async Task<IResult> CreateBooking(int eventId,
                                                     BookingService bookingService,
                                                     UsersService usersService,
                                                     HttpContext context)
    {
        try
        {
            UserModel user = await usersService.GetUserFromToken(context.Request.Cookies["jwt"]);
            var userId = user.Id;
            BookingModel bookingModel = new BookingModel()
            {
                EventId = eventId,
                UserId = userId,
                BookingDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                HasAttended = false,
                IsCancelled = false
            };
            var bookingId = await bookingService.CreateBookingAsync(bookingModel);
            return Results.Created($"/bookings/{bookingId}", bookingId);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> UpdateBooking(BookingRequest request, BookingService bookingService, HttpContext context, UsersService usersService)
    {
        try
        {

            var userId = request.UserId;
            if(userId == 0)
            {
                userId = (await usersService.GetUserFromToken(context.Request.Cookies["jwt"])).Id;
            }

            BookingModel bookingModel = new BookingModel()
            {
                EventId = request.EventId,
                UserId = userId,
                BookingDate = request.BookingDate,
                UpdatedAt = DateTime.UtcNow,
                HasAttended = request.HasAttended,
                IsCancelled = request.IsCancelled
            };

            await bookingService.UpdateBookingAsync(request.Id, bookingModel);

            return Results.Ok(request.Id);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> DeleteBooking(int bookingId, BookingService bookingService)
    {
        try
        {
            var result = await bookingService.DeleteBookingAsync(bookingId);

            if (!result)
                return Results.BadRequest(bookingId);

            return Results.Ok(bookingId);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }
}
;

