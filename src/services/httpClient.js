const baseAddress = "http://localhost:5250";

async function apiFetch(path, options = {}) {
    const res = await fetch(`${baseAddress}/${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        let errorBody = null;
        try {
            errorBody = await res.json();
        } catch {
            errorBody = await res.text();
        }

        throw Error({
            status: res.status,
            body: errorBody,
        });
    }

    if (res.status === 204) return null;
    return await res.json();
}


function genericGet(path, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${path}?${query}` : path;

    return apiFetch(url, {
        method: "GET",
    });
}

function genericPost(path, body = undefined) {
    return apiFetch(path, {
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

export {genericGet, genericPost}