import { Routes, Route} from 'react-router-dom';
import HomePage from './components/Landing.jsx';
import Register from './components/Register.jsx';
import Navbar from './components/Nav.jsx';
import Button from './components/button.jsx';
import Dash from './components/dash.jsx';


function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Register />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/Nav" element={<Navbar />} />
        <Route path="/button" element={<Button />} />
        
      </Routes>
    </main>
  );
}

export default App;
