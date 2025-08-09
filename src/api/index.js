import { fetchEventSource } from '@microsoft/fetch-event-source';

export const fetchApi = async (url, options = {}) => {
    const headers = { ...options.headers };

    // Only set Content-Type if body exists and is not FormData
    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
        throw new Error(errorData.message);
    }

    return response.json();
};

export const fetchEventSourceApi = (url, options) => {
    const headers = {
        'Accept': 'text/event-stream',
        ...options.headers,
    };

    // Only set Content-Type if body exists and is not FormData
    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    return fetchEventSource(url, {
        ...options,
        headers,
        credentials: 'include'
    });
};
