"use client";
import { useEffect, useState } from "react";
import { Button, message, Modal, Typography, Form, Select } from "antd";
import { getAllBookings, createBooking, updateBooking, deleteBooking, BookingRequest } from "../services/bookings";
import { getAllEvents, EventRequest } from "../services/events";
import { Role } from "../enums/Role";
import { useRouter } from "next/navigation";
import { getUserRole } from "../services/login";
import BookingList from "../components/BookingList";
import React from "react";

const { Title } = Typography;
const { Option } = Select;

export default function BookingPage() {
    const defaultValues: BookingRequest = {
        id: 0,
        eventId: 0,
        userId: 0,
        bookingDate: "",
        hasAttended: false,
        isCancelled: false,
    };

    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
    const [userRole, setUserRole] = useState<Role>(Role.User);
    const [values, setValues] = useState<BookingRequest>(defaultValues);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [events, setEvents] = useState<EventRequest[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookings, events, role] = await Promise.all([
                    getAllBookings(),
                    getAllEvents(),
                    getUserRole()
                ]);
                setBookings(bookings);
                setEvents(events);
                setUserRole(role);
            } catch (error) {
                message.error(error.message);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleCreateBooking = async (eventId: number) => {
        if (eventId === null) {
            message.error("Please select an event");
            return;
        }

        try {
            const request: BookingRequest = {
                ...defaultValues,
                eventId,
                bookingDate: new Date().toISOString(),
                userId: 1, 
            };
            await createBooking(request);
            const bookings = await getAllBookings();
            setBookings(bookings);
            window.location.reload();
            setIsModalVisible(false);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleUpdateBooking = async (eventId: number, request: BookingRequest) => {
        try {
            await updateBooking(eventId, request);
            const bookings = await getAllBookings();
            setBookings(bookings);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDeleteBooking = async (eventId: number) => {
        setBookingToDelete(eventId);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEventChange = (value: number) => {
        setSelectedEventId(value);
    };

    return (
        <div>
            {loading ? (
                <Title>Loading...</Title>
            ) : (
                <>
                    <Button type="primary" onClick={showModal} style={{ margin: '20px' }}>
                        Забронировать
                    </Button>
                    <BookingList
                        bookings={bookings}
                        handleCreate={handleCreateBooking}
                        handleUpdate={handleUpdateBooking}
                        handleDelete={handleDeleteBooking}
                        userRole={userRole}
                        isAdmin={userRole==Role.Admin}
                    />
                    <Modal
                        title="Create Booking"
                        visible={isModalVisible}
                        onOk={() => handleCreateBooking(selectedEventId)}
                        onCancel={handleCancel}
                    >
                        <Form layout="vertical">
                            <Form.Item label="Event">
                                <Select
                                    placeholder="Select an event"
                                    onChange={handleEventChange}
                                >
                                    {events.map(event => (
                                        <Option key={event.id} value={event.id}>
                                            {event.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </div>
    );
}
