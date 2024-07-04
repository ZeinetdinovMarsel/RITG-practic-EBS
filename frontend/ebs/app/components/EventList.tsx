import { Table, Button, Space, message } from "antd";
import { Role } from "../enums/Role";
import moment from "moment";
import { EventRequest } from "../services/events";
import { BookingRequest, createBooking } from "../services/bookings";

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
    ];
    columns.push({
        title: "Действия",
        key: "actions",
        render: (text: any, record: EventRequest) => (
            <Button type="primary" onClick={() => handleBook(record)}>Забронировать</Button>
        ),
    });
    if (userRole === Role.Admin) {
        columns.push({
            title: "Действия Админв",
            key: "actions",
            render: (text: any, record: EventRequest) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleOpen(record)}>Изменить</Button>
                    <Button onClick={() => handleDelete(record.id)}>Удалить</Button>
                </Space>
            ),
        });
        columns.unshift({
            title: "id",
            dataIndex: "id",
            key: "id",
        });
    }
    


    const handleBook = async (event: EventRequest) => {
        const bookingRequest: BookingRequest = {
            eventId: event.id,
            userId: 1,
            bookingDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
            hasAttended: false,
            isCancelled: false,
        };

       await createBooking(bookingRequest);

    };

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
