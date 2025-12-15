/**
 * Real-time Server - WebSocket server for live updates
 */

import { Server as SocketIOServer } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAuth } from '@/lib/middleware/auth'

export interface RealtimeEvent {
  type: string
  data: any
  timestamp: number
}

class RealtimeServer {
  private io: SocketIOServer | null = null
  private clients: Map<string, any> = new Map()

  /**
   * Initialize Socket.IO server
   */
  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      path: '/api/realtime',
      cors: {
        origin: process.env.NEXT_PUBLIC_BASE_URL || '*',
        methods: ['GET', 'POST'],
      },
    })

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)
      this.clients.set(socket.id, socket)

      // Handle authentication
      socket.on('authenticate', async (token: string) => {
        try {
          // Verify token
          const authResult = await verifyAuth({
            headers: {
              authorization: `Bearer ${token}`,
            },
          } as any)

          if (authResult.success) {
            socket.data.authenticated = true
            socket.data.userId = authResult.userId
            socket.emit('authenticated', { success: true })
          } else {
            socket.emit('authenticated', { success: false })
            socket.disconnect()
          }
        } catch (error) {
          socket.emit('authenticated', { success: false })
          socket.disconnect()
        }
      })

      // Handle subscriptions
      socket.on('subscribe', (channels: string[]) => {
        if (!socket.data.authenticated) {
          socket.emit('error', { message: 'Not authenticated' })
          return
        }

        channels.forEach((channel) => {
          socket.join(channel)
          console.log(`Client ${socket.id} subscribed to ${channel}`)
        })
      })

      // Handle unsubscriptions
      socket.on('unsubscribe', (channels: string[]) => {
        channels.forEach((channel) => {
          socket.leave(channel)
          console.log(`Client ${socket.id} unsubscribed from ${channel}`)
        })
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
        this.clients.delete(socket.id)
      })
    })

    return this.io
  }

  /**
   * Broadcast event to all clients
   */
  broadcast(event: RealtimeEvent) {
    if (!this.io) return
    this.io.emit('event', event)
  }

  /**
   * Send event to specific channel
   */
  toChannel(channel: string, event: RealtimeEvent) {
    if (!this.io) return
    this.io.to(channel).emit('event', event)
  }

  /**
   * Send event to specific user
   */
  toUser(userId: string, event: RealtimeEvent) {
    if (!this.io) return

    this.clients.forEach((socket) => {
      if (socket.data.userId === userId) {
        socket.emit('event', event)
      }
    })
  }

  /**
   * Get Socket.IO instance
   */
  getIO(): SocketIOServer | null {
    return this.io
  }
}

// Singleton instance
export const realtimeServer = new RealtimeServer()

// Helper functions for common events
export function broadcastContentUpdate(type: string, data: any) {
  realtimeServer.toChannel('content', {
    type: `content.${type}`,
    data,
    timestamp: Date.now(),
  })
}

export function broadcastUserUpdate(userId: string, data: any) {
  realtimeServer.toUser(userId, {
    type: 'user.update',
    data,
    timestamp: Date.now(),
  })
}

export function broadcastAdminUpdate(data: any) {
  realtimeServer.toChannel('admin', {
    type: 'admin.update',
    data,
    timestamp: Date.now(),
  })
}

