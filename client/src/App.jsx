import { Route, Routes } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/ErrorPage";

// user routes
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgetPassword from "./pages/ForgetPassword";




// user pages
import Home from "./pages/user/Home";
import Cart from "./pages/user/Cart";
import MovieDetail from "./pages/user/MovieDetail";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Checkout from "./pages/user/Checkout";



import ThemeContext from "./context/ThemeContext";


function App() {
  return (
    <ThemeContext>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/movies/:slug" element={<MovieDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />

        </Route>
        <Route path="*" element={<ErrorPage />}></Route>

      </Routes>

    </ThemeContext>
  );
}

export default App;
