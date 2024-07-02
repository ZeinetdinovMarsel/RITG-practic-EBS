using EBS.Core.Abstractions;
using EBS.Core.Models;

namespace EBS.Application.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;

    public EventService(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public Task<List<EventModel>> GetAllEventsAsync()
    {
        return _eventRepository.GetAllEventsAsync();
    }

    public Task<EventModel> GetEventByIdAsync(int eventId)
    {
        return _eventRepository.GetEventByIdAsync(eventId);
    }

    public Task<EventModel> CreateEventAsync(EventModel eventModel)
    {
        return _eventRepository.CreateEventAsync(eventModel);
    }

    public Task<EventModel> UpdateEventAsync(int eventId, EventModel eventModel)
    {
        return _eventRepository.UpdateEventAsync(eventId, eventModel);
    }

    public Task<bool> DeleteEventAsync(int eventId)
    {
        return _eventRepository.DeleteEventAsync(eventId);
    }
}
