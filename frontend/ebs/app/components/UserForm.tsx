import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { RegisterRequest } from '../services/register';
import { updateUser } from '../services/users';

interface UserProfileFormProps {
  user: RegisterRequest;
  onUpdate: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ user, onUpdate }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: RegisterRequest) => {
    updateUser({
      ...values,
      oldPassword: values.oldPassword 
    });
    message.success(`Пользователь ${values.username} был обновлен`);
    onUpdate();
  };

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={user}
    >
      <Form.Item
        name="username"
        label="Имя"
        rules={[{ required: true, message: 'Введите имя пользователя!' }]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: 'email', message: 'Введите правильную почту!' }]}
      >
        <Input prefix={<MailOutlined />} />
      </Form.Item>
      <Form.Item
        name="password"
        label="Новый пароль"
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>
      <Form.Item
        name="oldPassword"
        label="Старый пароль"
        rules={[{ required: true, message: 'Введите старый пароль!' }]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить изменения
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserProfileForm;