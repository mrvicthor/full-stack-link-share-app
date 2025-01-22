// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login";
import Home from "./pages/home";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
