import React, { useEffect, useState } from 'react';
import { Spin, Statistic, List } from 'antd';
import { getAttendanceStatistics } from '../services/statistics';
import { getAllEvents, EventRequest } from '../services/events';

const AttendanceStatistics = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventRequest[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [statisticsData, eventsData] = await Promise.all([
          getAttendanceStatistics(),
          getAllEvents()
        ]);
        setStatistics(statisticsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Ошибка при загрузке статистики посещаемости:', error);
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

  if (loading) return <Spin />;

  return (
    <div>
      <h2>Статистика посещаемости</h2>
      <Statistic title="Всего посетителей" value={statistics?.totalAttendees} />
      <List
        header={<div>Процент посещаемости по мероприятиям</div>}
        bordered
        dataSource={Object.keys(statistics?.attendanceRateByEvent || {}).map((eventId: string) => ({
          eventId,
          attendanceRate: statistics.attendanceRateByEvent[eventId],
        }))}
        renderItem={(item: any) => (
          <List.Item>
            Мероприятие "{getEventName(item.eventId)}"<br/> Процент посещаемости: {item.attendanceRate * 100}%
          </List.Item>
        )}
      />
    </div>
  );
};

export default AttendanceStatistics;
