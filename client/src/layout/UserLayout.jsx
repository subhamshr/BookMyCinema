import { Outlet } from "react-router-dom";

import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";

const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <main style={{ minHeight: "80vh", paddingTop: "5rem" }}>
        <Outlet />
      </main>
      <UserFooter /> 
    </>
  );
};

export default UserLayout;
