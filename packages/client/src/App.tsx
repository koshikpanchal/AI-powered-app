import { Route, Routes } from 'react-router-dom';
import ChatBot from './components/chat/ChatBot';
import ReviewList from './components/reviews/ReviewList';

function App() {
   return (
      <div className="p-4 h-screen w-full">
         <Routes>
            <Route path="/" element={<ChatBot />} />
            <Route path="/reviews" element={<ReviewList productId={1} />} />
         </Routes>
      </div>
   );
}

export default App;
