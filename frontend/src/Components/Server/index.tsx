import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiTable } from 'react-icons/gi';
import { useSocket } from '../helpers/socket';

export const TableCount = 6;

export default function Server() {
  const socket = useSocket();

  useEffect(() => {
    socket?.emit('enter service');
  }, [socket]);

  return (
    <div className='flex w-full h-full items-center justify-center gap-5'>
      {new Array(TableCount).fill(0).map((_, tableInd) => (
        <Link
          to={'/server/' + (tableInd + 1)}
          className='p-10 bg-base-200 rounded-xl text-2xl font-bold text-white'
        >
          <div className='flex w-full justify-center pb-5'>
            <GiTable className='text-white' size='5rem' />
          </div>
          Tisch {tableInd + 1}
        </Link>
      ))}
    </div>
  );
}
