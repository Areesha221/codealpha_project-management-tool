import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
// Remove '/api' to get the base server URL for sockets
const SOCKET_URL = API_URL.replace('/api', '') 

let socket = null

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        token: localStorage.getItem('token') // Pass token for auth if needed
      }
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}