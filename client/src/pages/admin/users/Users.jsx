import { useEffect, useCallback, useState } from "react";

import TableContent from "../../../components/TableContent";
import Paginate from "../../../components/Paginate";

import { Card, CardHeader } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { listUser, setCurrentPage, setLimit } from "../../../slices/userSlice";

const Users = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  const { users, limit, currentPage, total } = useSelector(
    (state) => state.users
  );

  const getHeaders = (data) => {
    if (data?.length === 0) return [];
    const { createdAt, updatedAt, __v, _id, roles, ...rest } = data[0];
    rest.isAdmin = roles;
    return Object.keys(rest);
  };

  const initialFetch = useCallback(() => {
    dispatch(listUser({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const updateLimit = (number) => {
    dispatch(setLimit(number));
  };

  const updateCurrentPage = (number) => {
    dispatch(setCurrentPage(number));
  };

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  useEffect(() => {
    const data = [];
    users.map((item) => {
      const { isActive, isEmailVerified, roles, ...rest } = item;
      rest.isActive = isActive ? "Yes" : "No";
      rest.isEmailVerified = isEmailVerified ? "Yes" : "No";
      rest.isAdmin = roles.includes("admin") ? "Yes" : "No";
      data.push(rest);
    });
    setFilteredUsers(data);
  }, [users]);
  return (
    <>
      <Card>
        <CardHeader className="fs-1">
          Users
        </CardHeader>

        <Card.Body>
          {users && (
            <TableContent
              headers={getHeaders(users)}
              data={filteredUsers}
              edit="/admin/users"
              remove="/admin/user"
            />
          )}
          <Paginate
            total={total}
            limit={limit}
            currentPage={currentPage}
            setCurrentPage={updateCurrentPage}
            setLimit={updateLimit}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default Users;
