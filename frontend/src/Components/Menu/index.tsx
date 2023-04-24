import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';

import { Link, useNavigate, useParams } from 'react-router-dom';
import menu from '../helpers/menu';
import { useSocket } from '../helpers/socket';

export default function Menu() {
  const { tableNr } = useParams();
  const [order, changeOrder] = useState<number[]>([]);
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    socket?.emit('enter service');
  }, [socket]);

  const addItem = (id: number) => {
    changeOrder((old) => [...old, id]);
  };

  const submit = () => {
    //send the whole order to the kitchen
    socket?.emit('send order', tableNr, order);
    navigate('/server');
  };

  return (
    <div className='p-5 h-full'>
      <div className='p-5'>
        <div className='flex justify-between'>
          <Link to='/server' className='flex items-center text-xl gap-2'>
            <IoArrowBack size='3rem' /> Zurück
          </Link>
          <h2 className='text-4xl font-bold mb-4 text-center w-full'>
            Speisekarte
          </h2>
        </div>

        <div className='flex flex-wrap gap-3 mt-5'>
          {menu.map((item, i) => (
            <div
              className='p-4 bg-base-200 rounded-lg'
              onClick={() => addItem(i)}
            >
              <item.img className='mx-auto' />
              <div className='text-2xl text-center font-bold pt-1'>
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
      {order.length > 0 && (
        <div className='absolute left-0 bottom-0 w-full p-5'>
          <div className='absolute bg-base-100 text-2xl font-bold left-10 top-0 px-1'>
            Bestellung
          </div>
          <div className='rounded-lg border border-white p-5'>
            <div className='flex gap-3 flex-wrap'>
              {order.map((menuId, i) => {
                const item = menu[menuId];
                return (
                  <div
                    key={menuId + '_' + i}
                    className='bg-base-200 rounded-lg p-3'
                    onClick={() =>
                      changeOrder((old) => old.filter((_, ind) => ind !== i))
                    }
                  >
                    <item.img className='mx-auto' />
                    <div className='text-xl text-center font-bold pt-1'>
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            disabled={!socket}
            className='absolute bottom-5 right-5 btn btn-success btn-lg btn-circle'
            onClick={submit}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
