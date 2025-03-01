import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { v4 as uuidv4 } from 'uuid'

const ChatContext = createContext()

export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState({})
  const [unreadMessages, setUnreadMessages] = useState({})
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

  useEffect(() => {
    if (currentUser) {
      // Simulate fetching chats from an API
      const mockChats = [
        {
          id: '1',
          propertyId: '1',
          propertyTitle: 'Modern Apartment in Downtown',
          participants: ['admin', currentUser.uid],
          lastMessage: {
            text: 'Is this property still available?',
            sender: currentUser.uid,
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
          }
        }
      ]
      
      const mockMessages = {
        '1': [
          {
            id: '1',
            text: 'Hello, I am interested in this property.',
            sender: currentUser.uid,
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
          },
          {
            id: '2',
            text: 'Great! What would you like to know about it?',
            sender: 'admin',
            timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString() // 55 minutes ago
          },
          {
            id: '3',
            text: 'Is this property still available?',
            sender: currentUser.uid,
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
          }
        ]
      }
      
      const mockUnreadMessages = {
        '1': 1 // 1 unread message in chat with id '1'
      }
      
      setChats(mockChats)
      setMessages(mockMessages)
      setUnreadMessages(mockUnreadMessages)
    } else {
      setChats([])
      setMessages({})
      setUnreadMessages({})
      setActiveChat(null)
    }
  }, [currentUser])

  const startNewChat = (propertyId, propertyTitle) => {
    // Check if chat already exists for this property
    const existingChat = chats.find(chat => chat.propertyId === propertyId)
    
    if (existingChat) {
      setActiveChat(existingChat.id)
      setIsWidgetOpen(true)
      return existingChat.id
    }
    
    // Create new chat
    const newChatId = uuidv4()
    const newChat = {
      id: newChatId,
      propertyId,
      propertyTitle,
      participants: ['admin', currentUser?.uid],
      lastMessage: null
    }
    
    setChats(prev => [newChat, ...prev])
    setMessages(prev => ({ ...prev, [newChatId]: [] }))
    setActiveChat(newChatId)
    setIsWidgetOpen(true)
    
    return newChatId
  }

  const sendMessage = (chatId, text) => {
    if (!currentUser) return null
    
    const newMessage = {
      id: uuidv4(),
      text,
      sender: currentUser.uid,
      timestamp: new Date().toISOString()
    }
    
    // Update messages
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }))
    
    // Update last message in chat
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: newMessage } 
          : chat
      )
    )
    
    // Simulate response from admin after 2 seconds
    setTimeout(() => {
      const adminResponse = {
        id: uuidv4(),
        text: 'Thank you for your message. I will get back to you shortly.',
        sender: 'admin',
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), adminResponse]
      }))
      
      setChats(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, lastMessage: adminResponse } 
            : chat
        )
      )
      
      // Add unread message if chat is not active
      if (activeChat !== chatId) {
        setUnreadMessages(prev => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1
        }))
      }
    }, 2000)
    
    return newMessage
  }

  const markChatAsRead = (chatId) => {
    setUnreadMessages(prev => ({
      ...prev,
      [chatId]: 0
    }))
  }

  const toggleChatWidget = () => {
    setIsWidgetOpen(prev => !prev)
  }

  const getTotalUnreadCount = () => {
    return Object.values(unreadMessages).reduce((sum, count) => sum + count, 0)
  }

  const value = {
    chats,
    activeChat,
    messages,
    unreadMessages,
    isWidgetOpen,
    startNewChat,
    sendMessage,
    setActiveChat,
    markChatAsRead,
    toggleChatWidget,
    getTotalUnreadCount
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}