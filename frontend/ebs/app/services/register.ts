import { message } from "antd";

export interface RegisterRequest {
    userName: string,
    password: string,
    email: string,
}

export const register = async (registerRequest: RegisterRequest): Promise<boolean> => {
    try {
        const response = await fetch("http://localhost:5183/user/register", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(registerRequest),
        });
        if (response.ok) {
            message.success("Регистрация прощла успешно");
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
}