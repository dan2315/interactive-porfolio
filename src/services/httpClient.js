import { useAdminStore } from "../stores/AdminStore";

const baseAddress = process.env.BACKEND_URL ?? "http://localhost:5250";

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

function adminFetch(path) {
  let explicitKey = null;

  const exec = async (method, body) => {
    const store = useAdminStore.getState();
    const apiKey = explicitKey ?? store.apiKey;

    try {
      const res = await fetch(`${baseAddress}/${path}`, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "X-Admin-Key": apiKey } : {}),
        },
        body: body,
      });

      console.log("admin res", res)
      
      if (res.status === 401 || res.status === 403) {
        store.clearApiKey?.();
        throw new Error("INVALID_ADMIN_KEY");
      }
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      if (res.status === 204) return null;
      return res.json();
    } catch (e) {
      console.error("Error during Admin request: ", e)
    }
  };

  return {
    withKey(key) {
      explicitKey = key;
      return this;
    },

    get() {
      return exec("GET");
    },

    post(body) {
      return exec("POST", body);
    },

    put(body) {
      return exec("PUT", body);
    },

    patch(body) {
      return exec("PATCH", body);
    },

    delete() {
      return exec("DELETE");
    },
  };
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

export { genericGet, genericPost, adminFetch };
