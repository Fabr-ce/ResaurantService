import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import menu from '../helpers/menu';
import { useSocket } from '../helpers/socket';

type OrderType = {
  tableNr: number;
  menu: { id: number; finished: boolean }[];
};

export default function Kitchen() {
  const socket = useSocket();
  const [orders, changeOrders] = useState<OrderType[]>([]);

  const finishItem = (orderId: number, itemId: number) => {
    const startFin = orders[orderId].menu.reduce(
      (pre, curr) => pre && curr.finished,
      true
    );
    const newOrders = orders.map((order, ind) => {
      if (ind === orderId) {
        const menu = order.menu.map(({ id, finished }, ind) =>
          ind === itemId ? { id, finished: !finished } : { id, finished }
        );
        return { tableNr: order.tableNr, menu };
      } else {
        return order;
      }
    });
    changeOrders(newOrders);

    const finished = newOrders[orderId].menu.reduce(
      (pre, curr) => pre && curr.finished,
      true
    );
    if (finished) {
      socket?.emit('finished order', newOrders[orderId].tableNr);
    }

    if (startFin) {
      socket?.emit('unfinished order', newOrders[orderId].tableNr);
    }
  };

  const removeOrder = (tableNr: number) => {
    changeOrders((old) => old.filter((order) => order.tableNr !== tableNr));
    socket?.emit('remove order', tableNr);
  };

  useEffect(() => {
    socket?.on('receive order', (tableNr: number, order: number[]) => {
      const fullOrder: OrderType = {
        tableNr,
        menu: order.map((item) => ({ id: item, finished: false })),
      };
      changeOrders((old) => [
        ...old.filter((item) => item.tableNr !== tableNr),
        fullOrder,
      ]);
    });
  }, [socket]);

  return (
    <div className='p-5'>
      <h2 className='text-4xl font-bold mb-4 text-center w-full'>Küche</h2>
      <div className='flex flex-wrap justify-center w-full gap-3'>
        {orders.map((order, orderId) => {
          const allFinished = order.menu.reduce(
            (pre, curr) => pre && curr.finished,
            true
          );
          return (
            <div
              className={classNames('relative rounded-lg p-4 border max-w-lg', {
                'bg-success/10': allFinished,
              })}
            >
              <h4 className={classNames('text-2xl font-bold text-center mb-3')}>
                Tisch {order.tableNr}
              </h4>
              <div className='grid grid-cols-4 gap-3'>
                {order.menu.map((item, i) => {
                  const menuItem = menu[item.id];
                  return (
                    <div
                      key={item.id + '_' + i}
                      className={classNames('rounded-lg p-3', {
                        'bg-base-200': !item.finished,
                        'bg-success/10 text-white/30 shadow-inner':
                          item.finished,
                      })}
                      onClick={() => finishItem(orderId, i)}
                    >
                      <menuItem.img
                        className={classNames('mx-auto', {
                          'opacity-20': item.finished,
                        })}
                      />
                      <div className='text-lg text-center font-bold pt-1'>
                        {menuItem.title}
                      </div>
                    </div>
                  );
                })}
              </div>
              {allFinished && (
                <button
                  disabled={!socket}
                  className='absolute top-0 right-0 btn btn-error btn-circle'
                  onClick={() => removeOrder(order.tableNr)}
                >
                  X
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
