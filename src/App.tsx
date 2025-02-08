import { useState } from 'react';
import './App.css'
import Landing from './land'
import Dashboard from './dashboard/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');

  return (
    <>
      {currentPage === 'landing' ? (
        <Landing onNavigate={() => setCurrentPage('dashboard')} />
      ) : (
        <Dashboard onNavigate={() => setCurrentPage('landing')} />
      )}
    </>
  )
}

export default App
