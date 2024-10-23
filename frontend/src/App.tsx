import React from 'react'
import Header from './features/Header/components/Header';
import Sidebar from './features/Labels/components/Sidebar'
import Notes from './features/Notes/components/Notes'
import './App.css'
import { Routes, Route, Navigate} from 'react-router-dom'
import { GlobalProvider } from './context/GlobalContext';



const App: React.FC = () => {
  
  return (
    <>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Navigate to={`${import.meta.env.VITE_BASE_URL}/Notes`}/>} />
          <Route path='/:labelId' element={
            <>
              <Header />
              <Sidebar />
              <Notes />
            </>
          } />
        </Routes>
      </GlobalProvider>
    </>
  )
}

export default App
