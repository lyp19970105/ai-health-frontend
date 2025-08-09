import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getConversationDetails, getConversations, streamChat, streamVlmChat } from '../api/chatApi';
import imageCompression from 'browser-image-compression';
import ConversationSidebar from '../components/chat/ConversationSidebar';
import './ChatPageLayout.css'; // Main layout CSS
import './ChatPage.css';       // Component-specific CSS

function ChatPage() {
    const { appCode, conversationId: convIdFromUrl } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const app = location.state?.app;
    const modelType = app?.modelType || 'TEXT';
    const appName = app?.appName || appCode;

    const [userInput, setUserInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(convIdFromUrl);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Effect to fetch conversation list
    useEffect(() => {
        const fetchConversations = async () => {
            if (appCode) {
                try {
                    const response = await getConversations(appCode);
                    if (response?.data?.content) {
                        setConversations(response.data.content);
                    }
                } catch (error) {
                    console.error('Error fetching conversations:', error);
                }
            }
        };
        fetchConversations();
    }, [appCode]);

    // Effect to fetch message history when URL changes
    useEffect(() => {
        const fetchHistory = async () => {
            if (convIdFromUrl) {
                setIsLoading(true);
                setMessages([]); // Clear previous messages
                try {
                    const response = await getConversationDetails(convIdFromUrl);
                    if (response?.data?.messages) {
                        setMessages(response.data.messages);
                    }
                } catch (error) {
                    console.error('Error fetching conversation history:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // If there's no conversationId in URL, it's a new chat.
                setMessages([]);
            }
        };
        fetchHistory();
        setConversationId(convIdFromUrl); // Sync state with URL
    }, [convIdFromUrl]);

    useEffect(scrollToBottom, [messages]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            setImageFile(compressedFile);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error('Image compression failed:', error);
            setImageFile(file); // Fallback to original
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!userInput.trim() && !imageFile) || isLoading) return;

        setIsLoading(true);
        
        const userMessageContent = (
            <div>
                {imagePreview && <img src={imagePreview} alt="preview" className="message-image-preview" />}
                {userInput}
            </div>
        );
        const userMessage = { role: 'user', content: userMessageContent };
        setMessages(prev => [...prev, userMessage, { role: 'assistant', content: '' }]);
        
        const currentInput = userInput;
        const currentImage = imageFile;
        
        setUserInput('');
        removeImage();

        const updateError = (errorMessage) => {
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage?.role === 'assistant') {
                    newMessages[newMessages.length - 1] = { ...lastMessage, content: errorMessage, isError: true };
                }
                return newMessages;
            });
        };

        try {
            const handlers = {
                onopen: async (response) => {
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
                    }
                },
                onmessage(event) {
                    if (event.data === '[DONE]') return;

                    try {
                        const parsedData = JSON.parse(event.data);
                        if (parsedData.code !== 0) throw new Error(parsedData.message || 'Unknown error');

                        const { answer, conversationId: newConvId } = parsedData.data || {};

                        if (newConvId && !conversationId) {
                            setConversationId(newConvId);
                            // Add new conversation to the list without re-fetching
                            setConversations(prev => [{ 
                                id: Date.now(), // Temporary unique key for React
                                platformConversationId: newConvId, 
                                name: `新对话...` 
                            }, ...prev]);
                            navigate(`/apps/${appCode}/chat/${newConvId}`, { replace: true, state: { app } });
                        }

                        if (typeof answer === 'string') {
                            setMessages(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.role === 'assistant') {
                                    const updatedLast = { ...last, content: last.content + answer };
                                    return [...prev.slice(0, -1), updatedLast];
                                }
                                return prev;
                            });
                        }
                    } catch (error) {
                        updateError(`解析数据失败: ${error.message}`);
                    }
                },
                onclose: () => setIsLoading(false),
                onerror: (err) => { throw err; },
            };

            const payload = { appCode, userInput: currentInput, conversationId };
            if (modelType === 'VLM') {
                await streamVlmChat({ ...payload, image: currentImage }, handlers);
            } else {
                await streamChat(payload, handlers);
            }

        } catch (err) {
            setIsLoading(false);
            updateError(`抱歉，请求失败了。

**错误详情:**
${err.message}`);
            console.error('Stream failed:', err);
        }
    };

    return (
        <div className="chat-page-layout">
            <ConversationSidebar appCode={appCode} conversations={conversations} app={app} />
            <main className="chat-main">
                <header className="App-header">
                    <h1>{appName}</h1>
                </header>
                <div className="chat-window">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="avatar">{msg.role === 'user' ? 'U' : 'A'}</div>
                                <div className={`content ${msg.isError ? 'error-content' : ''}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className="chat-form">
                        {imagePreview && (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="preview" className="image-preview" />
                                <button type="button" onClick={removeImage} className="remove-image-btn">&times;</button>
                            </div>
                        )}
                        <div className="input-area">
                            {modelType === 'VLM' && (
                                <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()} disabled={isLoading}>
                                    🖼️
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="请输入您的问题..."
                                rows="3"
                                disabled={isLoading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? '发送中...' : '发送'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ChatPage;
