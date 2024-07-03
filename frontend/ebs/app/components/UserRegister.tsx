import { RegisterRequest } from "../services/register";
import { useState } from "react";
import { Option } from "antd/es/mentions";
import { Form, Input, Button, Select, message } from "antd";

interface Props {
    handleRegister: (request: RegisterRequest) => void;
    navigateToLogin: () => void;
}

export const UserRegister = ({
    handleRegister,
    navigateToLogin,
}: Props) => {
    const [userName, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const onFinish = () => {
        if (password !== confirmPassword) {
            message.error('Пароли не совпадают');
            return;
        }

        const registerRequest: RegisterRequest = {
            userName,
            email,
            password,
        };
        handleRegister(registerRequest);
    };

    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item label="Имя" name="name" initialValue={userName}>
                <Input
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Имя"
                />
            </Form.Item>
            <Form.Item label="Почта" name="email" initialValue={email}>
                <Input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Почта"
                />
            </Form.Item>
            <Form.Item label="Пароль" name="password" initialValue={password}>
                <Input.Password
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                />
            </Form.Item>
            <Form.Item label="Подтверждение пароля" name="confirmPassword" initialValue={confirmPassword}>
                <Input.Password
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Подтвердите пароль"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Зарегистрироваться
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="default" onClick={navigateToLogin}>
                    Авторизоваться
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserRegister;
