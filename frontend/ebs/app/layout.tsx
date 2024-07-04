"use client";
import React, { useEffect, useState } from "react";
import Layout, { Header, Content, Footer } from "antd/es/layout/layout";
import { Menu } from "antd";
import Link from "next/link";
import "./globals.css";

import { useRouter } from "next/navigation";
import { getUserRole } from "./services/login";
import { Role } from "./enums/Role";

const items = [
  { key: "Home", label: <Link href={"/"}>Главная</Link> },
  { key: "Events", label: <Link href={"/events"}>Мероприятия</Link> },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState<Role>(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5183/user/profile", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const content = await response.json();
        setName(content.username);
        const role = await getUserRole();
        setUserRole(role);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  }, []);

  const isAuthenticated = !!name;

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5183/user/logout", {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout request failed');
      }

      router.push('/login');
      window.location.reload();
      setName('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: "100vh" }}>
          <Header>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ flex: 1, minWidth: 0 }}
            >
              {items.map(item => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
              {userRole === Role.Admin && isAuthenticated && (
                <>
                  <Menu.Item key="AdminPanel">
                    <Link href={"/admin"}>Админ</Link>
                  </Menu.Item>
                  <Menu.Item key="Statistics">
                    <Link href={"/statistics"}>Статистика</Link>
                  </Menu.Item>
                </>
              )}
              {isAuthenticated ? (
                <>
                  <Menu.Item key="Bookings">
                    <Link href={"/bookings"}>Бронирование</Link>
                  </Menu.Item>
                  <Menu.Item key="User">
                    <Link href={"/user"}>Профиль</Link>
                  </Menu.Item>
                  <Menu.Item key="Logout" onClick={handleLogout}>
                    Выход
                  </Menu.Item></>
              ) : (
                <Menu.Item key="Auth">
                  <Link href={"/login"}>Авторизация</Link>
                </Menu.Item>
              )}
            </Menu>
          </Header>
          <Content style={{ padding: "0 48px" }}>{children}</Content>
          <Footer style={{ textAlign: "center" }}>
            Прототип Event Booking System 2024 Зейнетдинова Марселя
          </Footer>
        </Layout>
      </body>
    </html>
  );
}
