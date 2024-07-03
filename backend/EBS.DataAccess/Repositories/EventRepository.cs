using EBS.Core.Abstractions;
using EBS.Core.Models;
using EBS.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EBS.DataAccess.Repositories;
public class EventRepository : IEventRepository
{
    private readonly EBSDbContext _dbContext;

    public EventRepository(EBSDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<EventModel>> GetAllEventsAsync()
    {
        return await _dbContext.Events
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

    public async Task<EventModel> GetEventByIdAsync(int eventId)
    {
        var eventEntity = await _dbContext.Events.FindAsync(eventId);

        if (eventEntity == null)
            return null;

        return new EventModel
        {
            Id = eventEntity.Id,
            Title = eventEntity.Title,
            Description = eventEntity.Description,
            Location = eventEntity.Location,
            Date = eventEntity.Date,
            MaxAttendees = eventEntity.MaxAttendees,
            CreatedAt = eventEntity.CreatedAt,
            UpdatedAt = eventEntity.UpdatedAt
        };
    }

    public async Task<EventModel> CreateEventAsync(EventModel eventModel)
    {
        var eventEntity = await _dbContext.Events
        .AsNoTracking()
        .FirstOrDefaultAsync(e => e.Title == eventModel.Title);

        if (eventEntity != null)
        {
            throw new InvalidOperationException("Мероприятие с таким названием уже существует");
        }
        if (eventModel.Date < DateTime.UtcNow.AddHours(4))
        {
            throw new Exception("Дата мероприятия не может быть объявлена раньше чем за 4 часа до начала");
        }
        eventEntity = new EventEntity
        {
            Title = eventModel.Title,
            Description = eventModel.Description,
            Location = eventModel.Location,
            Date = eventModel.Date,
            MaxAttendees = eventModel.MaxAttendees,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Events.Add(eventEntity);
        _dbContext.SaveChanges();

        eventModel.Id = eventEntity.Id;
        eventModel.CreatedAt = eventEntity.CreatedAt;
        eventModel.UpdatedAt = eventEntity.UpdatedAt;

        return eventModel;
    }

    public async Task<EventModel> UpdateEventAsync(int eventId, EventModel eventModel)
    {
        var eventEntity = await _dbContext.Events.FindAsync(eventId);

        if (eventEntity == null)
            return null;

        if (eventModel.Date < DateTime.UtcNow.AddHours(4))
        {
            throw new Exception("Дата мероприятия не может быть объявлена раньше чем за 4 часа до начала");
        }

        eventEntity.Title = eventModel.Title;
        eventEntity.Description = eventModel.Description;
        eventEntity.Location = eventModel.Location;
        eventEntity.Date = eventModel.Date;
        eventEntity.MaxAttendees = eventModel.MaxAttendees;
        eventEntity.UpdatedAt = DateTime.UtcNow;


        _dbContext.SaveChanges();

        return eventModel;
    }

    public async Task<bool> DeleteEventAsync(int eventId)
    {
        var eventEntity = await _dbContext.Events.FindAsync(eventId);

        if (eventEntity == null)
            return false;

        _dbContext.Events.Remove(eventEntity);
        _dbContext.SaveChanges();

        return true;
    }
}


