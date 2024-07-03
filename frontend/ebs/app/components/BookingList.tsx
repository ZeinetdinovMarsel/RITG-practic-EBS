import React, { useEffect, useState } from "react";
import { message, Table, Space, Button } from "antd";
import { BookingRequest, deleteBooking, getAllBookings } from "../services/bookings";


const BookingList: React.FC = () => {
    const [bookings, setBookings] = useState<BookingRequest[]>([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {

        const data = await getAllBookings();
        setBookings(data);
    };

    const handleDelete = async (bookingId: number) => {
        const deleted = await deleteBooking(bookingId);
        fetchBookings();

    };

    const columns = [
        { title: "Event ID", dataIndex: "eventId", key: "eventId" },
        { title: "Booking Date", dataIndex: "bookingDate", key: "bookingDate" },
        { title: "Has Attended", dataIndex: "hasAttended", key: "hasAttended" },
        { title: "Is Cancelled", dataIndex: "isCancelled", key: "isCancelled" },
        {
            title: "Actions",
            key: "actions",
            render: (text: any, record: BookingRequest) => (
                <Space size="middle">
                    <Button onClick={() => handleDelete(record.eventId)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={bookings} />;
};

export default BookingList;
