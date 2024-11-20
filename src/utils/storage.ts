export const saveStorageToken = (token: string) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("poker_access_token", JSON.stringify(token));
        return;
    }
}

export const getStorageToken = () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem("poker_access_token")) {
        return JSON.parse(localStorage.getItem("poker_access_token") ?? '');
    }
    return null;
}

export const clearStorageToken = () => {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("poker_access_token");
        return;
    }
    return;
}