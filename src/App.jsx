import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [resources, setResources] = useState([]); // "resources" are basically our links
  const [newLink, setNewLink] = useState('')

  async function addResource() {
    if (newLink.length === 0) {
      return;
    } 

    const { data, error } = await supabase
      .from('resources')
      .insert([{ title: newLink }])

    if (error) {
      console.log("Error", error);
    } else {
      setResources([...resources, data[0]])
      setNewLink('')
    }
  }

  async function fetchResources() {
    const { data, error } = await supabase.from("resources").select("*");

    if (error) {
      console.log("Error", error);
    } else {
      setResources(data);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchResources();
    }
    loadData();
  }, [])

  return (
    <div>
      <h1>My Dev Resources</h1>
      <ul>
        {resources.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
