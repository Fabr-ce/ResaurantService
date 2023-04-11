import React from 'react';
import { Link } from 'react-router-dom';

import { IoRestaurant } from 'react-icons/io5';
import { GiCook } from 'react-icons/gi';
import { CgScreen } from 'react-icons/cg';

const links = [
  { title: 'Service', icon: IoRestaurant, to: '/server' },
  { title: 'Küche', icon: GiCook, to: '/kitchen' },
  { title: 'Bildschirm', icon: CgScreen, to: '/screen' },
];

export default function Home() {
  return (
    <div className='flex w-full h-full items-center justify-center gap-5'>
      {links.map((link) => (
        <Link
          to={link.to}
          className='p-10 bg-base-200 rounded-xl text-2xl font-bold text-white'
        >
          <div className='flex w-full justify-center pb-5'>
            <link.icon className='text-white' size='5rem' />
          </div>

          {link.title}
        </Link>
      ))}
    </div>
  );
}
