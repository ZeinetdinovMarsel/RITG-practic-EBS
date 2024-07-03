"use client";

import { useEffect, useState } from "react";
import {
  LoginRequest,
  login
} from "../services/login";
import { UserLogin } from "../components/UserLogin";
import { useRouter } from "next/navigation";

export default function Login() {
  const defaultValues = {
    email: "",
    password: ""
  } as Login


  const [values, setValues] = useState<Login>(defaultValues);
  const router = useRouter();

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

  const isAuthenticated = !!name;

  if(isAuthenticated){
    router.push('/');
  }
  
  const handleLogin = async (request: LoginRequest) => {
    const success = await login(request);
    if (success) {
      router.push('/');

      window.location.reload();
    } else {

    }
  }
  const navigateToRegister = () => {
    router.push('/register');
  };
  return (
    <UserLogin
      values={values}
      handleLogin={handleLogin}
      navigateToRegister={navigateToRegister}
    />
  )
}