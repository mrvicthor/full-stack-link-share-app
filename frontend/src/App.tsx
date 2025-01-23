// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Routes, Route, Outlet } from "react-router-dom";
import LoginForm from "./pages/login";
import Home from "./pages/home";
import Layout from "./components/Layout";
import WelcomeScreen from "./pages/WelcomeScreen";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />

      <Route path="/" element={<Home />}>
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route index element={<WelcomeScreen />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
