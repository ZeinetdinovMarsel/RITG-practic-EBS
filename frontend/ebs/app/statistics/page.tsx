"use client";
import React, { useEffect, useState } from 'react';
import AttendanceStatistics from '../components/AttendanceStatistics';
import { Tabs } from 'antd';
import BookingsStatistics from '../components/BookingStatistics';
import { Role } from '../enums/Role';
import { getUserRole } from '../services/login';
import { useRouter } from 'next/navigation';

const { TabPane } = Tabs;

const StatisticsPage = () => {
  const [userRole, setUserRole] = useState<Role>(1);
  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      try {
        
        const role = await getUserRole();
        setUserRole(role);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  }, []);

  if(userRole != Role.Admin){
    router.push('/');
  }
  return (
    <div style={{ padding: '20px' }}>
      <h1>Панель статистики</h1>
      <Tabs defaultActiveKey="bookings">
        <TabPane tab="Статистика бронирований" key="bookings">
          <BookingsStatistics />
        </TabPane>
        <TabPane tab="Статистика посещаемости" key="attendance">
          <AttendanceStatistics />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StatisticsPage;
