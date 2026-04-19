// Jupiter backend does not have a notification socket endpoint.
// This hook is kept as a stub to avoid breaking the SocketContext.
import type { Notification } from '@/types/socket-types';
import { useCallback, useState } from 'react';
import type { Socket } from 'socket.io-client';

export function useNotifications(_token: string | null) {
  const [socket] = useState<Socket | null>(null);
  const [notifications] = useState<Notification[]>([]);
  const [isConnected] = useState(false);
  const [error] = useState<string | null>(null);

  const markAsRead = useCallback((_notificationId: string) => {}, []);
  const clearNotification = useCallback((_notificationId: string) => {}, []);
  const clearAllNotifications = useCallback(() => {}, []);

  return {
    socket,
    notifications,
    isConnected,
    error,
    markAsRead,
    clearNotification,
    clearAllNotifications,
  };
}
