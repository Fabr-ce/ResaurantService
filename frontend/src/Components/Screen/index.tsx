import React, { useEffect, useState } from 'react';
import menu from '../helpers/menu';
import { useSocket } from '../helpers/socket';
import { GiTable } from 'react-icons/gi';
import classNames from 'classnames';

export default function Screen() {
  const socket = useSocket();

  const [waitingOrders, changeWaiting] = useState<number[]>([]);
  const [finishedOrders, changeFinished] = useState<number[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('enter screen');
    socket.on('receive order', (tableNr: number) => {
      changeFinished((oldFin) => oldFin.filter((f) => f !== tableNr));
      changeWaiting((oldWait) => [
        ...oldWait.filter((w) => w !== tableNr),
        tableNr,
      ]);
    });
    socket.on('unfinished order', (tableNr: number) => {
      changeFinished((oldFin) => oldFin.filter((f) => f !== tableNr));
      changeWaiting((oldWait) => [
        ...oldWait.filter((w) => w !== tableNr),
        tableNr,
      ]);
    });
    socket.on('finished order', (tableNr: number) => {
      changeWaiting((oldWait) => oldWait.filter((f) => f !== tableNr));
      changeFinished((oldFin) => [
        ...oldFin.filter((f) => f !== tableNr),
        tableNr,
      ]);
    });
    socket.on('remove order', (tableNr: number) => {
      changeWaiting((oldWait) => oldWait.filter((w) => w !== tableNr));
      changeFinished((oldFin) => oldFin.filter((f) => f !== tableNr));
    });
  }, [socket]);

  return (
    <div className='w-full h-full flex flex-col py-5'>
      <h1 className='text-center text-5xl font-bold mb-4'>
        Restaurant Städtli
      </h1>
      <div className='w-full flex py-5 flex-grow'>
        <div className='w-full border-r flex flex-col'>
          <h2 className='text-center text-2xl font-bold'>Bestellung</h2>
          <div className='w-full flex p-5 flex-grow'>
            <div className='w-full border-r p-3 flex flex-col flex-wrap gap-3'>
              <h5 className='font-bold text-lg mb-3'>In Bearbeitung</h5>
              {waitingOrders.map((order) => (
                <TableItem key={order} tableNr={order} finished={false} />
              ))}
            </div>
            <div className='w-full p-3 flex flex-col flex-wrap gap-3'>
              <h5 className='font-bold text-lg mb-3'>Fertig</h5>
              {finishedOrders.map((order) => (
                <TableItem key={order} tableNr={order} finished={true} />
              ))}
            </div>
          </div>
        </div>
        <div className='w-full'>
          <h2 className='text-center text-2xl font-bold'>Menu</h2>
          <div className='p-5 grid grid-cols-2 gap-3'>
            {menu.map((item) => (
              <div className='w-full flex gap-3'>
                <div className='p-3 bg-base-200 rounded-lg'>
                  <item.img className='mx-auto' />
                </div>
                <div>
                  <h5 className='text-lg font-bold'>{item.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TableItem = ({
  tableNr,
  finished,
}: {
  tableNr: number;
  finished: boolean;
}) => {
  return (
    <div
      className={classNames('p-2 rounded-lg text-2xl font-bold text-white', {
        'bg-warning/30': !finished,
        'bg-success/30': finished,
      })}
    >
      <div className='flex w-full justify-center pb-5'>
        <GiTable className='text-white' size='4rem' />
      </div>
      <div className='text-center pb-2'>Tisch {tableNr}</div>
    </div>
  );
};
