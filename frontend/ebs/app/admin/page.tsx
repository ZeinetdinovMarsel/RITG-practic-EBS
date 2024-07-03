"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import { Role } from "../enums/Role";
import { RegisterRequest, createUser, deleteUser, getUsersByRole, updateUser } from "../services/users";
import { User } from "../Models/User";
import UserList from "../components/UserList";
import CreateUpdateUser from "../components/CreateUpdateUser";

export default function AdminPage() {
    const defaultValues = {
        userId: "",
        username: "",
        password: "",
        email: "",
        isAdmin: false
    } as User;

    const [values, setValues] = useState<User>(defaultValues);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [mode, setMode] = useState("create");
    const router = useRouter();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersAdmin = await getUsersByRole(Role.Admin);
                const usersDefault = await getUsersByRole(Role.User);
                const users = [
                    ...usersAdmin,
                    ...usersDefault,
                ]
                setUsers(users);
                setLoading(false);
            } catch (error) {
                message.error(error.message);
                setLoading(false);
                router.push('/login');
            }
        };

        getUsers();
    }, []);

    const handleCreateUser = async (request: User) => {
        try {
            await createUser(request);
            closeModal();
            const usersAdmin = await getUsersByRole(Role.Admin);
                const usersDefault = await getUsersByRole(Role.User);
                const users = [
                    ...usersAdmin,
                    ...usersDefault,
                ]
                setUsers(users);
            message.success(`Пользователь ${request.username} был создан`);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleUpdateUser = async (userId: string, request: RegisterRequest) => {
        try {
            await updateUser(request);
            closeModal();
            const usersAdmin = await getUsersByRole(Role.Admin);
            const usersDefault = await getUsersByRole(Role.User);
            const users = [
                ...usersAdmin,
                ...usersDefault,
            ]
            setUsers(users);
            message.success(`Пользователь ${request.username} был обновлен`);
        } catch (error) {
            message.error(error.message);
        }
    };


    const handleDeleteUser = async (id: string) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete);
            message.success("Пользователь был удален");
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            const usersAdmin = await getUsersByRole(Role.Admin);
                const usersDefault = await getUsersByRole(Role.User);
                const users = [
                    ...usersAdmin,
                    ...usersDefault,
                ]
                setUsers(users);
        } catch (error) {
            message.error(error.message);
        }
    };

    const cancelDeleteUser = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const openEditModal = (userId: string, user: User) => {
        setMode("edit");
        setValues(user);
        setIsModalOpen(true);
    };

    const openModal = () => {
        setMode("create");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setValues(defaultValues);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                style={{ marginTop: "30px" }}
                size="large"
                onClick={openModal}
            >
                Добавить пользователя
            </Button>

            <CreateUpdateUser
                mode={mode}
                values={values}
                isModalOpen={isModalOpen}
                handleCreate={handleCreateUser}
                handleUpdate={handleUpdateUser}
                handleCancel={closeModal}
            />

            {loading ? (
                <Title>Loading...</Title>
            ) : (
                <UserList
                    users={users}
                    handleOpen={openEditModal}
                    handleDelete={handleDeleteUser}
                />
            )}

            <Modal
                title="Подтверждение удаления"
                visible={isDeleteModalOpen}
                onOk={confirmDeleteUser}
                onCancel={cancelDeleteUser}
                okText="Удалить"
                cancelText="Отмена"
            >
                <p>Вы уверены, что хотите удалить этого пользователя?</p>
            </Modal>
        </div>
    );
}
