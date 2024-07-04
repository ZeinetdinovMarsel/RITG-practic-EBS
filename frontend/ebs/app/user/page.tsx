"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RegisterRequest } from '../services/register';
import UserProfileForm from '../components/UserForm';
import { message } from 'antd';

const UserDetailsPage: React.FC = () => {
  const [user, setUser] = useState<RegisterRequest | null>(null);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get<RegisterRequest>('http://localhost:5183/user/profile', {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  };

  const handleUpdate = () => {
    fetchUserDetails();
    
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Информация о пользователе</h1>
      <UserProfileForm user={user} onUpdate={handleUpdate} />
    </div>
  );
};

export default UserDetailsPage;
