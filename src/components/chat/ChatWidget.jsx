import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../contexts/ChatContext'

// MUI Icons
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Badge from '@mui/material/Badge'

const ChatWidget = () => {
  const { currentUser } = useAuth()
  const { 
    chats, 
    activeChat, 
    messages, 
    isWidgetOpen, 
    unreadMessages,
    setActiveChat, 
    sendMessage, 
    markChatAsRead,
    toggleChatWidget,
    getTotalUnreadCount
  } = useChat()
  
  const [messageText, setMessageText] = useState('')
  const messagesEndRef = useRef(null)
  
  useEffect(() => {
    // Scroll to bottom when messages change or chat opens
    if (messagesEndRef.current && isWidgetOpen && activeChat) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isWidgetOpen, activeChat])
  
  useEffect(() => {
    // Mark messages as read when chat is opened
    if (isWidgetOpen && activeChat) {
      markChatAsRead(activeChat)
    }
  }, [isWidgetOpen, activeChat, markChatAsRead])
  
  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (messageText.trim() && activeChat) {
      sendMessage(activeChat, messageText.trim())
      setMessageText('')
    }
  }
  
  const handleChatSelect = (chatId) => {
    setActiveChat(chatId)
    markChatAsRead(chatId)
  }
  
  // Don't render if user is not logged in
  if (!currentUser) return null
  
  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={toggleChatWidget}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        aria-label="Chat"
      >
        <Badge badgeContent={getTotalUnreadCount()} color="error">
          {isWidgetOpen ? <CloseIcon /> : <ChatIcon />}
        </Badge>
      </motion.button>
      
      {/* Chat Widget */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              {activeChat ? (
                <>
                  <button 
                    onClick={() => setActiveChat(null)} 
                    className="p-1 rounded-full hover:bg-primary-dark transition-colors"
                  >
                    <ArrowBackIcon fontSize="small" />
                  </button>
                  <h3 className="font-medium text-center flex-1">
                    {chats.find(chat => chat.id === activeChat)?.propertyTitle || 'Chat'}
                  </h3>
                </>
              ) : (
                <h3 className="font-medium">Messages</h3>
              )}
              <button 
                onClick={toggleChatWidget} 
                className="p-1 rounded-full hover:bg-primary-dark transition-colors"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
            
            {/* Chat List or Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeChat ? (
                // Messages
                <div className="space-y-4">
                  {messages[activeChat]?.length > 0 ? (
                    messages[activeChat].map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === currentUser.uid 
                              ? 'bg-primary text-white rounded-br-none' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === currentUser.uid 
                              ? 'text-blue-100' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No messages yet. Start the conversation!
                    </p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                // Chat List
                <div className="space-y-3">
                  {chats.length > 0 ? (
                    chats.map(chat => (
                      <div 
                        key={chat.id} 
                        onClick={() => handleChatSelect(chat.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          unreadMessages[chat.id] 
                            ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800 dark:text-white">
                            {chat.propertyTitle}
                          </h4>
                          {unreadMessages[chat.id] > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {unreadMessages[chat.id]}
                            </span>
                          )}
                        </div>
                        {chat.lastMessage && (
                          <div className="mt-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {chat.lastMessage.sender === currentUser.uid ? 'You: ' : ''}
                              {chat.lastMessage.text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No conversations yet. Start by inquiring about a property!
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Message Input */}
            {activeChat && (
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
                <button 
                  type="submit" 
                  disabled={!messageText.trim()}
                  className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SendIcon />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget