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
            app.MapPost("/events", CreateEvent).RequirePermissions(Permission.Create);
            app.MapPut("/events/{eventId}", UpdateEvent).RequirePermissions(Permission.Update);
            app.MapDelete("/events/{eventId}", DeleteEvent).RequirePermissions(Permission.Delete);

            return app;
        }

        private static async Task<IResult> GetAllEvents(EventService eventService)
        {
            var events = await eventService.GetAllEventsAsync();
            return Results.Ok(events);
        }

        private static async Task<IResult> GetEventById(int eventId, EventService eventService)
        {
            var @event = await eventService.GetEventByIdAsync(eventId);

            if (@event == null)
                return Results.NotFound();

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
                return Results.Created($"/api/events/{createdEvent.Id}", createdEvent);
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
                    return Results.NotFound();

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
                    return Results.NotFound();

                return Results.Ok();
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        }
    }
}
