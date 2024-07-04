import React, { useEffect, useState } from 'react';
import { Spin, Statistic, List } from 'antd';
import { getBookingsStatistics } from '../services/statistics';
import { getAllEvents, EventRequest } from '../services/events';

const BookingsStatistics = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventRequest[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [statisticsData, eventsData] = await Promise.all([
          getBookingsStatistics(),
          getAllEvents()
        ]);
        setStatistics(statisticsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Ошибка при загрузке статистики бронирований:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const getEventName = (eventId: string) => {
    const event = events.find(e => e.id === parseInt(eventId));
    return event ? event.title : 'Неизвестное мероприятие';
  };

  const getBookingWord = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'бронирование';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return 'бронирования';
    } else {
      return 'бронирований';
    }
  };

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleString('ru-RU', options);
  };

  if (loading) return <Spin />;

  return (
    <div>
      <h2>Статистика бронирований</h2>
      <Statistic title="Всего бронирований" value={statistics?.totalBookings} />

      <h3>Бронирования по мероприятиям</h3>
      <List
        bordered
        dataSource={Object.keys(statistics?.bookingsByEvent || {}).map((eventId: string) => ({
          eventId,
          bookingCount: statistics.bookingsByEvent[eventId],
        }))}
        renderItem={(item: any) => (
          <List.Item>
            Мероприятие "{getEventName(item.eventId)}":<br /> {item.bookingCount} {getBookingWord(item.bookingCount)}
          </List.Item>
        )}
      />

      <h3>Тенденции бронирования</h3>
      <List
        bordered
        dataSource={statistics?.bookingTrends}
        renderItem={(trend: any) => (
          <List.Item>
            {formatDateTime(trend.date)} Бронирований: {trend.count}
          </List.Item>
        )}
      />

      <h3>Популярные Мероприятия</h3>
      <List
        bordered
        dataSource={statistics?.popularEvents}
        renderItem={(event: any) => (
          <List.Item>
            Мероприятие: "{event.title}"<br /> Описание: "{event.description}"
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookingsStatistics;
