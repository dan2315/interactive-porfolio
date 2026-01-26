export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function setCookie(name, value, ttlMinutes) {
    const expires = new Date(Date.now() + ttlMinutes*60*1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}