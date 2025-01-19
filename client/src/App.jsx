import { Route, Routes } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/ErrorPage";

// user routes
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgetPassword from "./pages/ForgetPassword";

// admin routes
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/orders/Orders";
import Order from "./pages/admin/orders/Order";
import Movies from "./pages/admin/movies/Movies";
import Movie from "./pages/admin/movies/Movie";
import Users from "./pages/admin/users/Users";
import User from "./pages/admin/users/User";

// user pages
import UserLayout from "./layout/UserLayout";
import Home from "./pages/user/Home";
import Cart from "./pages/user/Cart";
import MovieDetail from "./pages/user/MovieDetail";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Checkout from "./pages/user/Checkout";

import ThemeContext from "./context/ThemeContext";

// routing check
import PrivateRoute from "./components/PrivateRoute";

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
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute component={<AdminLayout />} sysRoles={["admin"]} />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders/" element={<Orders />} />
          <Route path="orders/:id" element={<Order />} />
          <Route path="movies" element={<Movies />} />
          <Route path="movies/:id" element={<Movie />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<User />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </ThemeContext>
  );
}

export default App;
