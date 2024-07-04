import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import moment from "moment";
import { BookingRequest, getAllBookings, updateBooking } from "../services/bookings";
import { getAllEvents, EventRequest } from "../services/events";

interface Props {
    isAdmin: boolean;
}

const BookingList: React.FC<Props> = ({ isAdmin }) => {
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [events, setEvents] = useState<EventRequest[]>([]);

    useEffect(() => {
        fetchBookings();
        fetchEvents();
    }, []);

    const fetchBookings = async () => {
        const data = await getAllBookings();
        const sortedBookings = data.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
        setBookings(sortedBookings);
    };

    const fetchEvents = async () => {
        const data = await getAllEvents();
        setEvents(data);
    };

    const getEventTitle = (eventId: number) => {
        const event = events.find((event) => event.id === eventId);
        return event ? event.title : "Неизвестное мероприятие";
    };

    const handleCancel = async (bookingId: number) => {
        const updatedBookings = bookings.map((booking) => {
            if (booking.id === bookingId) {
                booking.isCancelled = true;
                updateBooking(bookingId, booking);
            }
            return booking;
        });
        setBookings(updatedBookings);
    };

    const handleAttended = async (bookingId: number) => {
        const updatedBookings = bookings.map((booking) => {
            if (booking.id === bookingId) {
                booking.hasAttended = true;
                updateBooking(bookingId, booking);
            }
            return booking;
        });
        setBookings(updatedBookings);
    };

    const columns = [
        { 
            title: "Мероприятие", 
            dataIndex: "eventId", 
            key: "eventTitle",
            render: (eventId: number) => getEventTitle(eventId),
            sorter: false,
        },
        { 
            title: "Дата", 
            dataIndex: "bookingDate", 
            key: "bookingDate",
            render: (date: string) => moment(date).format("YYYY-MM-DD HH:mm"),
            sorter: false,
        },
        { 
            title: "Действия/Статус",
            key: "actions",
            render: (text: any, record: BookingRequest) => (
                <Space size="middle">
                    {!record.isCancelled && !record.hasAttended && (
                        <>
                            <Button onClick={() => handleCancel(record.id)}>Отменить</Button>
                            <Button onClick={() => handleAttended(record.id)}>Посетил</Button>
                        </>
                    )}
                    {record.isCancelled && (
                        <span style={{ color: "red" }}>Отменено</span>
                    )}
                    {record.hasAttended && (
                        <span style={{ color: "green" }}>Посещено</span>
                    )}
                </Space>
            ),
        },
    ];


    if (isAdmin) {
        columns.unshift(
            { title: "ID брони", dataIndex: "id", key: "bookingId" },
            { title: "ID пользователя", dataIndex: "userId", key: "userId" }
        );
    }

    return <Table columns={columns} dataSource={bookings} rowKey="id" />;
};

export default BookingList;
