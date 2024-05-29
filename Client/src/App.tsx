import { useState } from 'react';
import './App.css'
import Layout from './layout/layout'

function App() {
  const [state, setState] = useState('')
  return (
      <>
        <Layout children={<> </>} />
    </>
  )
}

export default App
