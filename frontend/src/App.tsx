import React, { useEffect }  from 'react'
import Header from './components/header/Header';
import Notes from './components/main/Notes';
import Sidebar from './components/sidebar/Sidebar'
import './App.css'
import { NoteProvider } from './context/NoteContext';
import { Routes, Route, useNavigate} from 'react-router-dom'





const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/Notes`);
  }, [])

  return (
    <>
      <NoteProvider>
        <Header />
        <Routes>
          <Route path='/:labelId' element={
              <div className="container">
                <Sidebar />
                <Notes/>
              </div>
          } />
        </Routes>
      </NoteProvider>
    </>
  )
}

export default App
