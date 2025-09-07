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

  return <p className="font-bold p-4 text-3xl">{message}</p>;
}

export default App;
