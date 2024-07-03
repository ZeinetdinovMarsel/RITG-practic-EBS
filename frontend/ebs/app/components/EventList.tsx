import { Table, Button, Space } from "antd";
import { Role } from "../enums/Role";
import moment from "moment";
import { EventRequest } from "../services/events";

interface EventListProps {
    events: EventRequest[];
    handleOpen: (event: EventRequest) => void;
    handleDelete: (id: number) => void;
    userRole: Role;
}

const EventList: React.FC<EventListProps> = ({ events, handleOpen, handleDelete, userRole }) => {
    const columns = [
        {
            title: "Название",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Место проведения",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Дата",
            dataIndex: "date",
            key: "date",
            render: (date: string) => moment(date).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Макс. участников",
            dataIndex: "maxAttendees",
            key: "maxAttendees",
        },
        {
            title: "Действия",
            key: "actions",
            render: (text: any, record: EventRequest) => (
                userRole === Role.Admin && (
                    <Space size="middle">
                        <Button type="primary" onClick={() => handleOpen(record)}>Изменить</Button>
                        <Button onClick={() => handleDelete(record.id)}>Удалить</Button>
                    </Space>
                )
            ),
        },
    ];
    
    if (userRole === Role.Admin) {
        columns.unshift({
            title: "id",
            dataIndex: "id",
            key: "id",
        });
    }

    return (
        <Table
            columns={columns}
            dataSource={events}
            rowKey="id"
            pagination={{ pageSize: 7 }}
        />
    );
};

export default EventList;
