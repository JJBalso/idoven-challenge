import './App.css';
import Header from './components/header/Header';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from './pages/home/Home';
import Error from './pages/error/Error';

function App() {
  return (
    <Router>
      <header className='App-header'>
        <Header />
      </header>
      <section className='App-body'>
        <Routes>
          <Route path="/" element={<Home />} errorElement={<Error />}/>
          <Route path="/error" element={<Error />} />
        </Routes>      
      </section>
    </Router>
  );
}

export default App;
