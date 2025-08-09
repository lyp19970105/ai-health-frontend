import { fetchApi, fetchEventSourceApi } from './index';

/**
 * Fetches all configured AI applications.
 * @returns {Promise<Object>} The server response containing the list of apps.
 */
export const getApps = () => {
    return fetchApi('/api/apps');
};

/**
 * Fetches the list of conversations for a specific app.
 * @param {string} appCode - The code of the application.
 * @returns {Promise<Object>} The server response containing the list of conversations.
 */
export const getConversations = (appCode) => {
    return fetchApi(`/api/v1/conversations?appCode=${appCode}`);
};

/**
 * Fetches the detailed message history for a single conversation.
 * @param {string} conversationId - The ID of the conversation.
 * @returns {Promise<Object>} The server response containing the conversation details.
 */
export const getConversationDetails = (conversationId) => {
    return fetchApi(`/api/v1/conversations/${conversationId}`);
};

/**
 * Initiates a streaming chat session.
 * @param {Object} payload - The chat request payload.
 * @param {string} payload.appCode - The application code.
 * @param {string} payload.userInput - The user's input text.
 * @param {string|null} payload.conversationId - The current conversation ID, if any.
 * @param {Object} eventSourceHandlers - Handlers for the event source (onopen, onmessage, etc.).
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 */
export const streamChat = (payload, eventSourceHandlers) => {
    const { appCode, userInput, conversationId } = payload;
    return fetchEventSourceApi('/api/chat/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appCode,
            text: userInput, // 后端需要的是 text 字段
            conversationId,
        }),
        ...eventSourceHandlers,
    });
};

/**
 * Initiates a streaming VLM (Vision Language Model) chat session.
 * @param {Object} payload - The chat request payload.
 * @param {string} payload.appCode - The application code.
 * @param {string} payload.userInput - The user's input text.
 * @param {File} payload.image - The image file to upload.
 * @param {string|null} payload.conversationId - The current conversation ID, if any.
 * @param {Object} eventSourceHandlers - Handlers for the event source (onopen, onmessage, etc.).
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 */
export const streamVlmChat = (payload, eventSourceHandlers) => {
    const { appCode, userInput, image, conversationId } = payload;

    const formData = new FormData();
    formData.append('appCode', appCode);
    formData.append('text', userInput);
    if (image) {
        formData.append('image', image);
    }
    if (conversationId) {
        formData.append('conversationId', conversationId);
    }

    return fetchEventSourceApi('/api/chat/vlm/stream', {
        method: 'POST',
        // For multipart/form-data, we let the browser set the Content-Type header.
        // Do not set it manually.
        body: formData,
        ...eventSourceHandlers,
    });
};
