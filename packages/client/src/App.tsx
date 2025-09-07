import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

function App() {
   const [message, setMessage] = useState('');
   const fetchData = async () => {
      const { data } = await axios.get('/api/hello');
      setMessage(data.message);
   };
   useEffect(() => {
      fetchData();
   }, []);

   return (
      <div className="p-4">
         <Button>Click me</Button>
         <p className="font-bold text-3xl">{message}</p>
      </div>
   );
}

export default App;
