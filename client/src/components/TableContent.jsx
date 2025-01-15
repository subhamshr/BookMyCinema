import { useState } from "react";
import { Link } from "react-router-dom";

import { Table, Button, Modal } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

import { useDispatch } from "react-redux";
import { deleteMovie } from "../slices/movieSlice";
import { deleteUser } from "../slices/userSlice";

const TableContent = ({ headers = [], data = [], edit, remove }) => {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();

  const panelOption = remove?.split("/")[2];

  const handleClose = () => {
    setShow(false);
    setSelectedItem(null);
  };
  const handleShow = (item) => {
    setSelectedItem(item);
    setShow(true);
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S.No.</th>
            {headers.map((items, index) => {
              return (
                <th key={index} className="text-capitalize text-center">
                  {items}
                </th>
              );
            })}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {headers.map((key, index) => {
                    return <td key={index}>{item[key]}</td>;
                  })}
                  <td>
                    {edit && (
                      <Link
                        to={`${edit}/${item?.id || item?.slug || item?._id}`}
                      >
                        <CiEdit />
                      </Link>
                    )}
                    {remove && (
                      <>
                        <Button variant="link" onClick={() => handleShow(item)}>
                          <MdDeleteForever className="text-danger" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={headers.length + 2} style={{ textAlign: "center" }}>
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {selectedItem && (
        <Modal show={show} onHide={handleClose} backdrop={false}>
          <Modal.Header closeButton>
            <Modal.Title>
              Delete{" "}
              {panelOption === "movie"
                ? selectedItem?.title.concat(" ", "Movie")
                : selectedItem?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove this {panelOption}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                panelOption === "movie"
                  ? dispatch(deleteMovie(selectedItem?.slug))
                  : dispatch(deleteUser(selectedItem?._id));
                handleClose();
              }}
            >
              Delete {panelOption}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default TableContent;
