import { getCookie, setCookie } from "./cookie";

export function getSessionId() {
    const cookieName = "sessionId";
    const ttlMinutes = 30;

    let sessionId = getCookie(cookieName);
    let sessionTimestamp = getCookie("sessionTimestamp");

    const now = Date.now();

    if (!sessionId || !sessionTimestamp || (now - parseInt(sessionTimestamp)) > ttlMinutes*60*1000) {
        sessionId = crypto.randomUUID();
        setCookie(cookieName, sessionId, ttlMinutes);
    }

    setCookie("sessionTimestamp", now.toString(), ttlMinutes);

    return sessionId;
}