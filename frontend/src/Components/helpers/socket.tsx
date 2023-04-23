import { useState, createContext, useContext, useEffect } from 'react';

import io from 'socket.io-client';

type Socket = ReturnType<typeof io>;

const ENDPOINT = 'ws://' + location.host;

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
