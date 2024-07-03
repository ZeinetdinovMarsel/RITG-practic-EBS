import { message } from "antd";

export interface LoginRequest {
    email: string;
    password: string;
}

export const login = async (loginRequest: LoginRequest): Promise<boolean> => {
    try {
        const response = await fetch("http://localhost:5183/user/login", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(loginRequest),
            credentials: 'include'
        });

        if (response.ok) {
            message.success("Авторизация прошла успешно");
            return true;
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse.message}`);
            return false;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса');
        return false;
    }
};
export const getUserRole = async () => {
    try {
        const response = await fetch("http://localhost:5183/user/profile/role", {
            credentials: 'include'
        },
        );
        return await response.json();
    } catch (error) {
        return error;
    }
}