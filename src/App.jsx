import { Routes, Route} from 'react-router-dom';
import HomePage from './components/Landing.jsx';
import Register from './components/Register.jsx';
import Navbar from './components/Nav.jsx';
import Button from './components/Button.jsx';
import Dash_User from './components/dash_user.jsx';
import Dash_Admin from './components/dash_admin.jsx';


function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Register />} />
        <Route path="/dash_user" element={<Dash_User />} />
        <Route path="/dash_admin" element={<Dash_Admin />} />
        <Route path="/Nav" element={<Navbar />} />
        <Route path="/button" element={<Button />} />
        
      </Routes>
    </main>
  );
}

export default App;
