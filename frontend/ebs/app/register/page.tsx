"use client";

import {
  RegisterRequest,
  register
} from "../services/register";
import { useRouter } from "next/navigation";
import UserRegister from "../components/UserRegister";
import { useEffect, useState } from "react";

export default function Register() {

  const router = useRouter();
  const [name, setName] = useState('');
  useEffect(() => {
    async function fetchData() {
      try {
     
         const response = await fetch("http://localhost:5183/user", {
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
        setName(content.userName);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  }, []);

  const isAuthenticated = !!name;

  if(isAuthenticated){
    router.push('/');
  }
  const handleRegister = async (request: RegisterRequest) => {
    const success = await register(request);
    if (success) {
      router.push('/login');
    } else {

    }
  }
  const navigateToLogin = () => {
    router.push('/login');
  };
  return (
    <UserRegister
      handleRegister={handleRegister}
      navigateToLogin={navigateToLogin}
    />
  )
}