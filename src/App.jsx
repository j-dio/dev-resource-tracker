import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [resources, setResources] = useState([]) // "resources" are basically our links
  const [newLink, setNewLink] = useState('')

  console.log("Supabase connected:", supabase)

  return (
    <div className='app-container'>
      <h1>Dev Resource Tracker</h1>

      {/* 1. Input Section */}
      <div className='input-group'>
        <input
          type='text'
          placeholder='Paste a tutorial link...'
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <button>Add Resource</button>
      </div>

      {/* 2. Display Section */}
      <ul>
        {resources.map((resource, index) => (
          <li key={resource.id}>
            {/* something */}
            {resource.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
