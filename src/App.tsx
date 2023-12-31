import './App.css';
import Header from './components/header/Header';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from './pages/home/Home';
import Error from './pages/error/Error';
import Ecg from './pages/ecg/Ecg';

function App() {
  return (
    <Router>
      <Header />      
      <Routes>
        <Route path="/" element={<Home />} errorElement={<Error />}/>
        <Route path="/ecg" element={<Ecg />} errorElement={<Error />}/>
        <Route path="/error" element={<Error />} />
      </Routes>      
    </Router>
  );
}

export default App;
