import { Role } from "../enums/Role";

export interface RegisterRequest {
    userId: string,
    username: string,
    password: string,
    email: string,
    isAdmin: boolean
}


export const createUser = async (registerRequest: RegisterRequest) => {

    console.log(JSON.stringify(registerRequest));
    const response = await fetch("http://localhost:5183/user/register", {
        method: "POST",
        headers: {
            "content-type": "application/json",

        },
        credentials: 'include',
        body: JSON.stringify(registerRequest),
    });
    await checkResponse(response);
}

export const getUsersByRole = async (role: Role) => {
    const response = await fetch(`http://localhost:5183/users/role/all?roleId=${role}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
        credentials: 'include',
    });
    return await response.json();
}


export const updateUser = async (registerRequest: RegisterRequest) => {

    const response = await fetch("http://localhost:5183/user/profile/update", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(registerRequest),
    });
    await checkResponse(response);
    return await response.json();

}


export const deleteUser = async (id: string) => {
    const response = await fetch(`http://localhost:5183/user/profile/delete/${id}`, {
        method: "DELETE",
        credentials: 'include'
    });
    await checkResponse(response);
}

const checkResponse = async (response: Response) => {

    switch (response.status) {
        case 200:
            return;
        case 400:
            throw new Error(`${await response.json()}`);
        case 401:
            throw new Error("Вы не авторизованы для выполнения этого действия.");
        case 403:
            throw new Error("Доступ запрещен.");
        default:
            throw new Error(`HTTP error! Status: ${response.status}`);
    }
}
