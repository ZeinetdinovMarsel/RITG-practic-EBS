import { message } from "antd";

export interface EventRequest {
    id:number;
    title: string;
    description: string;
    location: string;
    date: Date;
    maxAttendees: number;
}

export const getAllEvents = async () => {
    try {
        
        const response = await fetch("http://localhost:5183/events", {
            credentials: 'include'
        });
        var responseJson = response.json();
        if (response.ok) {
            return responseJson;
        } else {
            message.error(`${responseJson}`);
            return [];
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса');
        return [];
    }
};

export const getEventById = async (eventId: number) => {
    try {
        const response = await fetch(`http://localhost:5183/events/${eventId}`, {
            credentials: 'include'
        });
        var responseJson = response.json();
        if (response.ok) {
            return responseJson;
        } else {
            message.error(`${responseJson}`);
            return null;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса');
        return null;
    }
};

export const createEvent = async (eventRequest: EventRequest) => {
    try {
    
        const response = await fetch("http://localhost:5183/events", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(eventRequest),
            credentials: 'include'
        });

        if (response.ok) {
            message.success("Мероприятие создано успешно");
            return true;
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse}`);
            return false;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса');
        return false;
    }
};

export const updateEvent = async (eventId: number, eventRequest: EventRequest) => {
    try {
    
        const response = await fetch(`http://localhost:5183/events/${eventId}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(eventRequest),
            credentials: 'include'
        });

        if (response.ok) {
            message.success("Мероприятие обновлено успешно");
            return true;
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse}`);
            return false;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса' + error);
        return false;
    }
};

export const deleteEvent = async (eventId: number) => {
    try {
        const response = await fetch(`http://localhost:5183/events/${eventId}`, {
            method: "DELETE",
            credentials: 'include'
        });

        if (response.ok) {
            message.success("Мероприятие удалено успешно");
            return true;
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse}`);
            return false;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса');
        return false;
    }
};
