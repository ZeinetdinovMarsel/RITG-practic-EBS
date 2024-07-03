import { message } from "antd";

export interface BookingRequest {
    eventId: number;
    bookingDate: string| null;
    hasAttended: boolean;
    isCancelled: boolean;
}

export const getAllBookings = async (): Promise<BookingRequest[]> => {
    try {
        const response = await fetch("http://localhost:5183/bookings", {
            credentials: 'include'
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse.message}`);
            return [];
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса' + error.message);
        return [];
    }
};

export const getBookingById = async (bookingId: number): Promise<BookingRequest | null> => {
    try {
        const response = await fetch(`http://localhost:5183/bookings/${bookingId}`, {
            credentials: 'include'
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse.message}`);
            return null;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса' + error.message);
        return null;
    }
};

export const createBooking = async (bookingRequest: BookingRequest): Promise<boolean> => {
    try {
        console.log(bookingRequest);
        const response = await fetch("http://localhost:5183/bookings", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(bookingRequest),
            credentials: 'include'
        });

        if (response.ok) {
            message.success("Бронирование успешно создано");
            return true;
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse.message}`);
            return false;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса' + error.message);
        return false;
    }
};

export const updateBooking = async (bookingId: number, bookingRequest: BookingRequest): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:5183/bookings/${bookingId}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(bookingRequest),
            credentials: 'include'
        });

        if (response.ok) {
            message.success("Бронирование успешно обновлено");
            return true;
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse.message}`);
            return false;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса' + error.message);
        return false;
    }
};

export const deleteBooking = async (bookingId: number): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:5183/bookings/${bookingId}`, {
            method: "DELETE",
            credentials: 'include'
        });

        if (response.ok) {
            message.success("Бронирование успешно удалено");
            return true;
        } else {
            const errorResponse = await response.json();
            message.error(`${errorResponse.message}`);
            return false;
        }
    } catch (error) {
        message.error('Произошла ошибка при выполнении запроса' + error.message);
        return false;
    }
};
