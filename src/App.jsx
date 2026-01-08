import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [resources, setResources] = useState([]); // "resources" are basically our links
  const [newLink, setNewLink] = useState("");

  async function addResource() {
    if (newLink.length === 0) {
      return;
    }

    const { data, error } = await supabase
      .from("resources")
      .insert([{ title: newLink }])
      .select(); // .select() returns the newly inserted row(s)

    if (error) {
      console.log("Error", error);
    } else {
      setResources([...resources, data[0]]); // some performance optimization as we don't have to fetch all resources again
      setNewLink("");
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
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>My Dev Resources</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="New resource..."
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <button onClick={addResource}>Add</button>
      </div>
      <div className="display-group">
        <ul>
          {resources.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
