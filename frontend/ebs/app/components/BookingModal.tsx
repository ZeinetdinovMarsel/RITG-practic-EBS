import React, { useState } from "react";
import { message, Form, Input, Button } from "antd";
import { BookingRequest, createBooking } from "../services/bookings";

export enum Mode {
    Create,
    Edit,
}

const BookingModal: React.FC = () => {
    const [booking, setBooking] = useState<BookingRequest>({
        eventId: 0,
        bookingDate: "",
        hasAttended: false,
        isCancelled: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
    };

    const handleSubmit = async () => {
       await createBooking(booking);
    };

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item label="Event ID">
                <Input name="eventId" onChange={handleInputChange} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Создать бронирование
                </Button>
            </Form.Item>
        </Form>
    );
};

export default BookingModal;
