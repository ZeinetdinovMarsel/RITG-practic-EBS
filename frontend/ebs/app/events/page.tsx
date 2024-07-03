"use client";
import { useEffect, useState } from "react";
import { Button, message, Modal, Typography } from "antd";
import { getAllEvents, createEvent, updateEvent, deleteEvent, EventRequest } from "../services/events";
import { Role } from "../enums/Role";
import { useRouter } from "next/navigation";
import { getUserRole } from "../services/login";
import EventModal, { Mode } from "../components/EventModal";
import EventList from "../components/EventList";

const { Title } = Typography;

export default function EventsPage() {
    const defaultValues: EventRequest = {
        id: 0,
        title: "",
        description: "",
        location: "",
        date: new Date(),
        maxAttendees: 0
    } as EventRequest;

    const [events, setEvents] = useState<EventRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);
    const [mode, setMode] = useState(Mode.Create);
    const [userRole, setUserRole] = useState<Role>(Role.User);
    const [values, setValues] = useState<EventRequest>(defaultValues);
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const events = await getAllEvents();
                setEvents(events);
                setLoading(false);
                const role = await getUserRole();
                setUserRole(role);
            } catch (error) {
                message.error(error.message);
                setLoading(false);
                router.push('/login');
            }
        };

        fetchEvents();
        console.log("Updated values:", values);
    }, [router,values]);

    const handleCreateEvent = async (request: EventRequest) => {
        try {
            await createEvent(request);
            closeModal();
            const events = await getAllEvents();
            setEvents(events);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleUpdateEvent = async (id: number, request: EventRequest) => {
        try {
            await updateEvent(id, request);
            closeModal();
            const events = await getAllEvents();
            setEvents(events);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDeleteEvent = async (id: number) => {
        setEventToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteEvent = async () => {
        if (!eventToDelete) return;

        try {
            await deleteEvent(eventToDelete);
            setIsDeleteModalOpen(false);
            setEventToDelete(null);
            const events = await getAllEvents();
            setEvents(events);
        } catch (error) {
            message.error(error.message);
        }
    };

    const cancelDeleteEvent = () => {
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
    };

    const openEditModal = (event: EventRequest) => {
        console
        setMode(Mode.Edit);
        setValues(event);
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
            {userRole !== Role.User && (
                <Button
                    type="primary"
                    style={{ marginTop: "30px" }}
                    size="large"
                    onClick={openModal}
                >
                    Создать мероприятие
                </Button>
            )}
            
            <EventModal
                mode={mode}
                values={values}
                isModalOpen={isModalOpen}
                handleCreate={handleCreateEvent}
                handleUpdate={handleUpdateEvent}
                handleCancel={closeModal}
            />

            {loading ? (
                <Title>Loading...</Title>
            ) : (
                <EventList
                    events={events}
                    handleOpen={openEditModal}
                    handleDelete={handleDeleteEvent}
                    userRole={userRole}
                />
            )}

            <Modal
                title="Подтверждение удаления"
                open={isDeleteModalOpen}
                onOk={confirmDeleteEvent}
                onCancel={cancelDeleteEvent}
                okText="Удалить"
                cancelText="Отмена"
            >
                <p>Вы уверены, что хотите удалить это мероприятие?</p>
            </Modal>
        </div>
    );
}
