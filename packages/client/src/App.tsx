import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const fetchData = async () => {
    const { data } = await axios.get("/api/hello");
    setMessage(data.message);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return <p>{message}</p>;
}

export default App;
