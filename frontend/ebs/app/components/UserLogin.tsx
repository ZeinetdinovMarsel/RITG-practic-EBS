import { LoginRequest } from "../services/login";
import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";

interface Props {
    values: Login;
    handleLogin: (request: LoginRequest) => void;
    navigateToRegister: () => void;
}

export const UserLogin = ({
    values,
    handleLogin,
    navigateToRegister,
}: Props) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        setEmail(values.email);
        setPassword(values.password);
    }, [values]);

    const onFinish = () => {
        handleLogin({ email, password });
    };

    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item label="Почта" name="email" initialValue={email}>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Почта"
                />
            </Form.Item>
            <Form.Item label="Пароль" name="password" initialValue={password}>
                <Input.Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Авторизоваться
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="default" onClick={navigateToRegister}>
                    Зарегистрироваться
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserLogin;
