import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [resources, setResources] = useState([]); // "resources" are basically our links
  const [newLink, setNewLink] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General"); // default category
  const [filterCategory, setFilterCategory] = useState("all");

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

  async function addResource() {
    if (!newLink.trim() || !newUrl.trim()) {
      return;
    }

    const { data, error } = await supabase
      .from("resources")
      .insert([{ title: newLink, url: newUrl, category: selectedCategory }])
      .select(); // .select() returns the newly inserted row(s)

    if (error) {
      console.log("Error", error);
    } else {
      setResources([...resources, data[0]]); // some performance optimization as we don't have to fetch all resources again
      setNewLink("");
      setNewUrl("");
    }
  }

  // function to take a specific id and delete that row from the database
  // remove that item from local resources using .filter
  async function deleteResource(id) {
    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
      console.log("Error", error);
    } else {
      setResources(resources.filter((item) => item.id !== id));
    }
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  }

  useEffect(() => {
    const fetchFilteredResources = async () => {
      if (filterCategory === "all") {
        await fetchResources();
        return;
      }
      
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("category", filterCategory);

      if (error) {
        console.log("Error", error);
      } else {
        setResources(data);
      }
    };

    fetchFilteredResources();
  }, [filterCategory]);

  return (
    <div>
      <h1>My Dev Resources</h1>
      <div className="filter-button">
        <select id="category-filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="general">General</option>
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
        </select>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="New resource..."
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <input
          type="text"
          placeholder="Url..."
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="general">General</option>
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
        </select>
        <button
          onClick={addResource}
          disabled={!newLink.trim() || !newUrl.trim()}
        >
          Add
        </button>
      </div>
      <div className="display-group">
        <ul>
          {resources.map((item) => (
            <li key={item.id}>
              <a href={item.url} target="_blank">
                {item.title}
              </a>
              <button onClick={() => deleteResource(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
