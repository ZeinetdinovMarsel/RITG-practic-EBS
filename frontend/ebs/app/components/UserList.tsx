import React from "react";
import { List, Button } from "antd";
import { User } from "../Models/User";
import { Role } from "../enums/Role";

interface UserListProps {
    users: User[];
    handleOpen: (userID: string, user: User) => void;
    handleDelete: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, handleOpen, handleDelete }) => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={users}
            renderItem={user => (
                <List.Item
                    actions={[
                        <Button key="edit" onClick={() => handleOpen(user.userId, user)}>Изменить</Button>,
                        <Button key="delete" onClick={() => handleDelete(user.userId)}>Удалить</Button>
                    ]}
                >
                    <List.Item.Meta
                        title={`ID: ${user.userId} | username: ${user.username}`}
                        description={(
                            <div>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Роль:</strong> {user.isAdmin ? 'Администратор' : 'Пользователь'}</p>
                            </div>
                        )}
                    />
                </List.Item>
            )}
        />
    );
};

export default UserList;
