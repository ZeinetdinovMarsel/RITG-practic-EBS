using EBS.API.Contracts;
using EBS.API.Extentions;
using EBS.Application.Services;
using EBS.Core.Enums;
using EBS.Core.Models;

namespace EBS.API.Endpoints
{
    public static class EventsEndpoints
    {
        public static IEndpointRouteBuilder MapEventsEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/events", GetAllEvents).RequirePermissions(Permission.Read);
            app.MapGet("/events/{eventId}", GetEventById).RequirePermissions(Permission.Read);
            app.MapPost("/events", CreateEvent).RequireRoles(Role.Admin);
            app.MapPut("/events/{eventId}", UpdateEvent).RequireRoles(Role.Admin);
            app.MapDelete("/events/{eventId}", DeleteEvent).RequireRoles(Role.Admin);

            return app;
        }

        private static async Task<IResult> GetAllEvents(EventService eventService)
        {
            var events = await eventService.GetAllEventsAsync();
            if (events == null)
            {
                return Results.BadRequest("Мероприятия не найдены");
            }
            return Results.Ok(events);
        }

        private static async Task<IResult> GetEventById(int eventId, EventService eventService)
        {
            var @event = await eventService.GetEventByIdAsync(eventId);

            if (@event == null)
                return Results.BadRequest($"Мероприятия с id: {eventId} не существует");

            return Results.Ok(@event);
        }

        private static async Task<IResult> CreateEvent(EventRequest eventRequest, EventService eventService)
        {
            try
            {
                EventModel eventModel = new EventModel()
                {
                    Title = eventRequest.Title,
                    Description = eventRequest.Description,
                    Location = eventRequest.Location,
                    Date = eventRequest.Date,
                    MaxAttendees = eventRequest.MaxAttendees,
                };
                var createdEvent = await eventService.CreateEventAsync(eventModel);
                return Results.Ok($"Мероприятие {createdEvent.Title}");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        }

        private static async Task<IResult> UpdateEvent(int eventId, EventModel eventRequest, EventService eventService)
        {
            try
            {
                EventModel eventModel = new EventModel()
                {
                    Title = eventRequest.Title,
                    Description = eventRequest.Description,
                    Location = eventRequest.Location,
                    Date = eventRequest.Date,
                    MaxAttendees = eventRequest.MaxAttendees,
                };

                var updatedEvent = await eventService.UpdateEventAsync(eventId, eventModel);

                if (updatedEvent == null)
                    return Results.BadRequest($"Мероприятия {eventRequest.Title} не существует");

                return Results.Ok(updatedEvent);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        }

        private static async Task<IResult> DeleteEvent(int eventId, EventService eventService)
        {
            try
            {
                var result = await eventService.DeleteEventAsync(eventId);

                if (!result)
                    return Results.BadRequest($"Мероприятия с id: {eventId} не существует");

                return Results.Ok($"Мероприятие было удалено");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        }
    }
}
