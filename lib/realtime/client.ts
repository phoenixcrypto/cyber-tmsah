/**
 * Real-time Client - Client-side WebSocket connection
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export interface RealtimeEvent {
  type: string
  data: any
  timestamp: number
}

export interface UseRealtimeOptions {
  token?: string
  channels?: string[]
  onEvent?: (event: RealtimeEvent) => void
  autoConnect?: boolean
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const {
    token,
    channels = [],
    onEvent,
    autoConnect = true,
  } = options

  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!autoConnect) return

    const socketUrl = process.env.NEXT_PUBLIC_REALTIME_URL || '/api/realtime'
    const newSocket = io(socketUrl, {
      path: '/api/realtime',
      transports: ['websocket', 'polling'],
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to realtime server')
      setConnected(true)

      // Authenticate if token provided
      if (token) {
        newSocket.emit('authenticate', token)
      }
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from realtime server')
      setConnected(false)
      setAuthenticated(false)
    })

    newSocket.on('authenticated', (data: { success: boolean }) => {
      setAuthenticated(data.success)
      if (data.success && channels.length > 0) {
        newSocket.emit('subscribe', channels)
      }
    })

    // Event handler
    newSocket.on('event', (event: RealtimeEvent) => {
      if (onEvent) {
        onEvent(event)
      }
    })

    // Cleanup
    return () => {
      if (channels.length > 0) {
        newSocket.emit('unsubscribe', channels)
      }
      newSocket.disconnect()
    }
  }, [autoConnect, token, channels.join(',')])

  const subscribe = (newChannels: string[]) => {
    if (socket && authenticated) {
      socket.emit('subscribe', newChannels)
    }
  }

  const unsubscribe = (channelsToRemove: string[]) => {
    if (socket) {
      socket.emit('unsubscribe', channelsToRemove)
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
    }
  }

  return {
    socket,
    connected,
    authenticated,
    subscribe,
    unsubscribe,
    disconnect,
  }
}

