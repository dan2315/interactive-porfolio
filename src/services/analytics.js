import { routes } from "../components/HtmlContent";
import { getSessionId } from "../utils/session";
import { baseAddress, genericGet, genericPost } from "./httpClient";
import * as signalR from "@microsoft/signalr";

let pageStartTimestamp = {
    page: "",
    value: null
};

let connection;

export const analytics = {
    getLiveAnalytics: () => {
        return genericGet("analytics/live/sessions");
    },
    connectToEventsPipe: () => {
        if (!connection) {
            connection = new signalR.HubConnectionBuilder()
                .withUrl(baseAddress+"/analytics/live/sessions-sr")
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();
        }

        return connection;
    },
    sendPageView: (additionalData = {}) => {
        const route = window.location.pathname;
        if (pageStartTimestamp.value && pageStartTimestamp.page !== route) {
            analytics.sendPageLeave(pageStartTimestamp.page);
        }

        pageStartTimestamp.page = route;
        pageStartTimestamp.value = Date.now();

        const event = {
            eventType: "page_view",
            timestamp: new Date().toISOString(),
            route,
            referer: document.referrer || null,
            userAgent: navigator.userAgent,
            sessionId: getSessionId(),
            additionalData: JSON.stringify(additionalData),
        };

        genericPost("analytics/event", event);
    },
    sendPageLeave: (route, additionalData) => {
        const sessionId = getSessionId();

        const timeOnPageMs = Date.now() - pageStartTimestamp.value;

        const event = {
            eventType: "page_leave",
            timestamp: new Date().toISOString(),
            route,
            referer: document.referrer || null,
            userAgent: navigator.userAgent,
            sessionId,
            timeOnPageMs,
            additionalData: JSON.stringify(additionalData),
        };

        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(event)], { type: "application/json" });
            navigator.sendBeacon(baseAddress + "/analytics/event", blob);
        } else {
            genericPost("analytics/event", event);
        }

        pageStartTimestamp.page = "";
        pageStartTimestamp.value = null;
    },
    sendCartridgeInserted: (cartridge) => {
        const route = window.location.pathname;
        
        const additionalData = {
            cartridge: routes[cartridge.getId()].name
        }

        console.log(JSON.stringify(additionalData))

        const event = {
            eventType: "cartridge_inserted",
            timestamp: new Date().toISOString(),
            route,
            referer: document.referrer || null,
            userAgent: navigator.userAgent,
            sessionId: getSessionId(),
            additionalData: JSON.stringify(additionalData),
        };

        genericPost("analytics/event", event);
    },
    sendContactAttempt: (additionalData) => {
        const route = window.location.pathname;

        const event = {
            eventType: "contact_attempt",
            timestamp: new Date().toISOString(),
            route,
            referer: document.referrer || null,
            userAgent: navigator.userAgent,
            sessionId: getSessionId(),
            additionalData: JSON.stringify(additionalData),
        };

        genericPost("analytics/event", event);
    }
};