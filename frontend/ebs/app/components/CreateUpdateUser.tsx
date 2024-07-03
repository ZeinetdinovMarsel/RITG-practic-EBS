import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Checkbox } from "antd";
import { RegisterRequest } from "../services/users";
import { User } from "../Models/User";
import Option from "antd/es/select";
import { Role } from "../enums/Role";

interface CreateUpdateUserProps {
    mode: string;
    values: User;
    isModalOpen: boolean;
    handleCreate: (request: RegisterRequest) => void;
    handleUpdate: (userId: string, request: RegisterRequest) => void;
    handleCancel: () => void;
}

const CreateUpdateUser: React.FC<CreateUpdateUserProps> = ({
    mode,
    values,
    isModalOpen,
    handleCreate,
    handleUpdate,
    handleCancel
}) => {
    const [form] = Form.useForm();
    const [isAdmin, setIsAdmin] = useState<boolean>(values.isAdmin);

    useEffect(() => {
        form.setFieldsValue(values);
        setIsAdmin(values.isAdmin);
    }, [values]);

    const onFinish = (values: User) => {
        if (mode === "create") {
            handleCreate(values);
        } else {
            handleUpdate(values.userId, values);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAdmin(e.target.checked);
        form.setFieldsValue({ ...form.getFieldsValue(), isAdmin: e.target.checked });
    };

    return (
        <Modal
            title={mode === "create" ? "Создать пользователя" : "Обновить пользователя"}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText={mode === "create" ? "Создать" : "Обновить"}
            cancelText="Отмена"
        >
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >
                {mode === "edit" && (
                    <Form.Item
                        name="userId"
                        label="User ID"
                        rules={[{ required: true, message: "Введите User ID" }]}
                    >
                        <Input disabled />
                    </Form.Item>
                )}
                <Form.Item
                    name="username"
                    label="Имя пользователя"
                    rules={[{ required: true, message: "Введите имя пользователя" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[{ required: true, message: "Введите пароль" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Введите email" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="isAdmin"
                    label="Роль"
                    valuePropName="checked"
                >
                    <Checkbox checked={isAdmin} onChange={handleCheckboxChange}>
                        {isAdmin ? "Администратор" : "Пользователь"}
                    </Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUpdateUser;
