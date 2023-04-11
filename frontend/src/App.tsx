import React, { useEffect } from 'react';
import { SocketProvider } from './Components/helpers/socket';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Server from './Components/Server';
import Kitchen from './Components/Kitchen';
import Home from './Components/Home';
import Screen from './Components/Screen';
import Menu from './Components/Menu';

function App() {
  useEffect(() => {}, []);

  return (
    <div className='h-screen w-screen absolute top-0'>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path='/server' element={<Server />} />
            <Route path='/server/:tableNr' element={<Menu />} />
            <Route path='/kitchen' element={<Kitchen />} />
            <Route path='/screen' element={<Screen />} />

            <Route path='/' element={<Home />} />
          </Routes>
        </Router>
      </SocketProvider>
    </div>
  );
}

export default App;
