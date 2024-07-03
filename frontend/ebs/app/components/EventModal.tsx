import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, InputNumber } from "antd";
import moment, { Moment } from "moment";
import { EventRequest } from "../services/events";

export enum Mode {
    Create,
    Edit,
}

interface EventModalProps {
    mode: Mode;
    values: EventRequest;
    isModalOpen: boolean;
    handleCreate: (request: EventRequest) => void;
    handleUpdate: (id: number, request: EventRequest) => void;
    handleCancel: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
    mode,
    values,
    isModalOpen,
    handleCreate,
    handleUpdate,
    handleCancel,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        const dateValue = values.date ? moment(values.date) : null;

        form.setFieldsValue({
            ...values,
            date: dateValue,
        });
    }, [values]);

    const handleSubmit = () => {
        form.validateFields().then((formValues) => {
            const eventRequest: EventRequest = {
                ...formValues,
                date: formValues.date ? formValues.date.toISOString() : null,
            };

            if (mode === Mode.Create) {
                handleCreate(eventRequest);
            } else if (mode === Mode.Edit) {
                handleUpdate(values.id, eventRequest);
            }
        });
    };

    return (
        <Modal
            title={mode === Mode.Create ? "Создать мероприятие" : "Изменить мероприятие"}
            visible={isModalOpen}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText={mode === Mode.Create ? "Создать" : "Изменить"}
            cancelText="Отмена"
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="Название"
                    name="title"
                    rules={[{ required: true, message: "Пожалуйста, введите название мероприятия" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Описание"
                    name="description"
                    rules={[{ required: true, message: "Пожалуйста, введите описание мероприятия" }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Место проведения"
                    name="location"
                    rules={[{ required: true, message: "Пожалуйста, введите место проведения мероприятия" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Дата и время"
                    name="date"
                    rules={[{ required: true, message: "Пожалуйста, выберите дату и время мероприятия" }]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>
                <Form.Item
                    label="Максимальное количество участников"
                    name="maxAttendees"
                    rules={[{ required: true, message: "Пожалуйста, введите максимальное количество участников" }]}
                >
                    <InputNumber min={1} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EventModal;
