// src/components/chat/ConversationSidebar.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './ConversationSidebar.css';

const ConversationSidebar = ({ appCode, conversations, app }) => {
    const { conversationId } = useParams();

    return (
        <div className="sidebar">
            <Link to={`/apps/${appCode}/chat`} state={{ app }} className="new-chat-button">
                + 新建对话
            </Link>
            <div className="conversation-list">
                {conversations.map(conv => (
                    <Link
                        key={conv.platformConversationId || conv.id} // Use platformId if available, fallback to id
                        to={`/apps/${appCode}/chat/${conv.platformConversationId}`}
                        state={{ app }}
                        className={`conversation-item ${conv.platformConversationId === conversationId ? 'active' : ''}`}
                    >
                        {conv.name || `对话 ${conv.id}`}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ConversationSidebar;
