using EBS.Core.Models;

namespace EBS.Core.Abstractions;
public interface IEventService
{
    Task<EventModel> CreateEventAsync(EventModel eventModel);
    Task<bool> DeleteEventAsync(int eventId);
    Task<List<EventModel>> GetAllEventsAsync();
    Task<EventModel> GetEventByIdAsync(int eventId);
    Task<EventModel> UpdateEventAsync(int eventId, EventModel eventModel);
}