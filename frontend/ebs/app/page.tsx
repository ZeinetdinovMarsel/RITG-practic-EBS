"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState('');

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

          console.log(content)
          setName(content.username);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      }
  
      fetchData();
    }, []);
  
    return (
        <div>
            <h1>{name ? 'Добро пожаловть ' + name : 'Вы не авторизованы'}</h1>
        </div>
    );
};
