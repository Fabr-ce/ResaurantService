import { useState, createContext, useContext, useEffect } from 'react';

import io from 'socket.io-client';

const ENDPOINT =
  'ws://' +
  (process.env.NODE_ENV === 'production'
    ? '192.168.60.130:5000'
    : 'localhost:5000');

type Socket = ReturnType<typeof io>;

const SocketContext = createContext<null | Socket>(null);

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const [socket, setSocket] = useState<null | Socket>(null);
  useEffect(() => {
    const socket = io(ENDPOINT);
    setSocket(socket);
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
