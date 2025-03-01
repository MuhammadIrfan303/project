import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// MUI Icons
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import ReplyIcon from '@mui/icons-material/Reply'

const MessageList = ({ messages, onReply, onDelete, onToggleRead }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState('')
  
  // Filter messages
  const filteredMessages = messages.filter(message => 
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleReply = () => {
    if (replyText.trim() && selectedMessage) {
      onReply(selectedMessage.id, replyText)
      setReplyText('')
      // Keep the message selected after reply
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          />
          <SearchIcon className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Message List */}
        <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <AnimatePresence>
            {filteredMessages.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMessages.map(message => (
                  <motion.li
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedMessage(message)}
                    className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 ${
                      selectedMessage?.id === message.id 
                        ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' 
                        : ''
                    } ${
                      !message.read 
                        ? 'bg-gray-50 dark:bg-gray-750' 
                        : ''
                    }`}
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !message.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        } truncate`}>
                          {message.subject}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300">
                            {message.propertyId ? 'Property Inquiry' : 'General'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            From: {message.sender.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500 truncate">
                            {message.content.substring(0, 50)}...
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No messages found matching your search.
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Message Detail */}
        <div className="hidden md:flex md:w-2/3 flex-col">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedMessage.subject}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onToggleRead(selectedMessage.id)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    aria-label={selectedMessage.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {selectedMessage.read ? (
                      <MarkEmailUnreadIcon fontSize="small" />
                    ) : (
                      <MarkEmailReadIcon fontSize="small" />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(selectedMessage.id)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    aria-label="Delete message"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
              
              {/* Message Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-750">
                <div className="flex items-center">
                  <img
                    src={selectedMessage.sender.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                    alt={selectedMessage.sender.name}
                    className="h-10 w-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedMessage.sender.name} <span className="text-gray-500 dark:text-gray-400">&lt;{selectedMessage.sender.email}&gt;</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {selectedMessage.propertyId && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Property:</span> {selectedMessage.propertyTitle || `ID: ${selectedMessage.propertyId}`}
                  </div>
                )}
              </div>
              
              {/* Message Content */}
              <div className="p-4 flex-1 overflow-y-auto">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {selectedMessage.content}
                </p>
                
                {/* Message History */}
                {selectedMessage.history && selectedMessage.history.length > 0 && (
                  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Previous Messages
                    </h3>
                    
                    <div className="space-y-4">
                      {selectedMessage.history.map((item, index) => (
                        <div key={index} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {item.isReply ? 'You' : selectedMessage.sender.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Reply Form */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <textarea
                        rows="3"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-gray-700"
                        placeholder="Write your reply..."
                      />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ReplyIcon className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select a message to view its contents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageList