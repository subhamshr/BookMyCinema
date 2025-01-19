import TableContent from "../../../components/TableContent";
import Paginate from "../../../components/Paginate";

import { Card, CardHeader } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import {
  listOrder,
  setCurrentPage,
  setLimit,
} from "../../../slices/orderSlice";

import { useEffect, useCallback } from "react";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, limit, currentPage, total } = useSelector(
    (state) => state.orders
  );

  const getHeaders = (data) => {
    if (data?.length === 0) return [];
    const { buyer, createdAt, id, products, updatedAt, __v, _id, ...rest } =
      data[0];
    return Object.keys(rest);
  };

  const initialFetch = useCallback(() => {
    dispatch(listOrder({ page: currentPage, limit }));
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
  return (
    <>
      <Card>
        <CardHeader className="fs-1">
          Orders
        </CardHeader>

        <Card.Body>
          {orders && (
            <TableContent
              headers={getHeaders(orders)}
              data={orders}
              edit="/admin/orders"
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

export default Orders;
