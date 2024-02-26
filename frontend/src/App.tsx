import React, { useEffect }  from 'react'
import Header from './features/Header/components/Header';
import Sidebar from './features/Labels/components/Sidebar'
import Notes from './features/Notes/components/Notes'
import './App.css'
import { Routes, Route, useNavigate, Navigate} from 'react-router-dom'
import { GlobalProvider } from './context/GlobalContext';





const App: React.FC = () => {



  return (
    <>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/Notes" />} />
          <Route path='/:labelId' element={
            <>
              <Header/>
              <div className="container">
                <Sidebar />
                <Notes/>
              </div>
            </>
          } />
        </Routes>
      </GlobalProvider>
    </>
  )
}

export default App
