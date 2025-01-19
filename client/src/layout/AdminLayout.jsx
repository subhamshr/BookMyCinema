import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="d-flex gap-3">
      <AdminSidebar />
      <div className="w-100 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
