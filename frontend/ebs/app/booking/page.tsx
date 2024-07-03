"use client";
import { useEffect, useState } from "react";
import { Button, message, Modal, Typography } from "antd";
import { getAllBookings, createBooking, updateBooking, deleteBooking, BookingRequest } from "../services/bookings";
import { Role } from "../enums/Role";
import { useRouter } from "next/navigation";
import { getUserRole } from "../services/login";
import BookingList from "../components/BookingList";
import React from "react";
import BookingModal, { Mode } from "../components/BookingModal";

const { Title } = Typography;

export default function BookingPage() {
    const defaultValues: BookingRequest = {
        eventId: 0,
        bookingDate: "",
        hasAttended: false,
        isCancelled: false,
    };

    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
    const [mode, setMode] = useState(Mode.Create);
    const [userRole, setUserRole] = useState<Role>(Role.User);
    const [values, setValues] = useState<BookingRequest>(defaultValues);
    const router = useRouter();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookings = await getAllBookings();
                setBookings(bookings);
                setLoading(false);
                const role = await getUserRole();
                setUserRole(role);
            } catch (error) {
                message.error(error.message);
                setLoading(false);
                router.push('/login');
            }
        };

        fetchBookings();
    }, [router]);

    const handleCreateBooking = async (request: BookingRequest) => {
        try {
            await createBooking(request);
            closeModal();
            const bookings = await getAllBookings();
            setBookings(bookings);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleUpdateBooking = async (eventId: number, request: BookingRequest) => {
        try {
            await updateBooking(eventId, request);
            closeModal();
            const bookings = await getAllBookings();
            setBookings(bookings);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDeleteBooking = async (eventId: number) => {
        setBookingToDelete(eventId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteBooking = async () => {
        if (!bookingToDelete) return;

        try {
            await deleteBooking(bookingToDelete);
            setIsDeleteModalOpen(false);
            setBookingToDelete(null);
            const bookings = await getAllBookings();
            setBookings(bookings);
        } catch (error) {
            message.error(error.message);
        }
    };

    const cancelDeleteBooking = () => {
        setIsDeleteModalOpen(false);
        setBookingToDelete(null);
    };

    const openEditModal = (booking: BookingRequest) => {
        setMode(Mode.Edit);
        setValues(booking);
        setIsModalOpen(true);
    };

    const openModal = () => {
        setMode(Mode.Create);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setValues(defaultValues);
        setIsModalOpen(false);
    };

    return (
        <div>

            <BookingModal
                mode={mode}
                values={values}
                isModalOpen={isModalOpen}
                handleCreate={handleCreateBooking}
                handleUpdate={handleUpdateBooking}
                handleCancel={closeModal}
            />

            {loading ? (
                <Title>Loading...</Title>
            ) : (
                <BookingList
                    bookings={bookings}
                    handleOpen={openEditModal}
                    handleDelete={handleDeleteBooking}
                    userRole={userRole}
                />
            )}

            <Modal
                title="Подтверждение удаления"
                visible={isDeleteModalOpen}
                onOk={confirmDeleteBooking}
                onCancel={cancelDeleteBooking}
                okText="Удалить"
                cancelText="Отмена"
            >
                <p>Вы уверены, что хотите удалить это бронирование?</p>
            </Modal>
        </div>
    );
}
