import { useEffect, useState } from 'react';
import io, { type Socket } from 'socket.io-client';

const API_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.jupitermarinesales.com';

export interface VisitorStats {
  active: number;
  todayVisitors: number;
  totalVisitors: number;
}

export function useVisitorSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [stats, setStats] = useState<VisitorStats>({
    active: 0,
    todayVisitors: 0,
    totalVisitors: 0,
  });

  useEffect(() => {
    const newSocket = io(API_URL, {
      path: '/ws',
      transports: ['polling'],
    });

    newSocket.on('connect', () => {
      console.log('🟢 Visitor socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔴 Visitor socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('visitors:count', (data: { active: number }) => {
      console.log('👥 visitors:count:', data);
      setActiveCount(data.active);
    });

    newSocket.on('visitors:stats', (data: VisitorStats) => {
      console.log('📊 visitors:stats:', data);
      setStats(data);
      setActiveCount(data.active);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Visitor socket error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('visitors:count');
      newSocket.off('visitors:stats');
      newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected, activeCount, stats };
}
