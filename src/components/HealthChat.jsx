import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './HealthChat.css';

const HealthChat = ({ contextData }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: t('chat.welcome') }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('medexplain_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ question: userMsg, context: contextData })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to get answer');

            setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'assistant', text: t('chat.error') }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="health-chat-container">
            {/* Chat Bubble Toggle */}
            <div className={`chat-bubble-wrapper ${isOpen ? 'hidden' : ''}`}>
                <button 
                    className="chat-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    title={t('chat.title')}
                >
                    <div className="chat-icon-wrapper">
                        <MessageCircle size={32} className="chat-base-icon" />
                        <div className="chat-accent-icon-container">
                            <Stethoscope size={14} className="chat-accent-icon" />
                        </div>
                    </div>
                </button>
                <div className="chat-badge-text">Medical AI</div>
            </div>

            {/* Chat Window */}
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="chat-avatar bg-primary">
                            <Bot size={18} color="white" />
                        </div>
                        <div>
                            <h3>{t('chat.title')}</h3>
                            <p>{t('chat.subtitle')}</p>
                        </div>
                    </div>
                    <button className="close-chat-btn" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role}`}>
                            {msg.role === 'assistant' && (
                                <div className="message-icon bot-icon">
                                    <Bot size={14} />
                                </div>
                            )}
                            <div className="message-bubble">
                                <p>{msg.text}</p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="message-icon user-icon">
                                    <User size={14} />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message assistant">
                            <div className="message-icon bot-icon">
                                <Bot size={14} />
                            </div>
                            <div className="message-bubble loading-bubble">
                                <Loader2 size={16} className="spin-icon" />
                                <span>{t('chat.analyzing')}</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder={t('chat.placeholder')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={!input.trim() || isLoading} className="send-btn">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HealthChat;
