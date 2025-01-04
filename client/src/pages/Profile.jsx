import { useEffect, useState } from "react";

import UserServices from "../services/users";

import { getToken } from "../utils/storage";

import { CiEdit } from "react-icons/ci";
import { Form, Card, Button } from "react-bootstrap";

import { Notify } from "../components/Notify";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [payload, setPayload] = useState({
    name: "",
    email: "",
  });
  const [passwordPayload, setPasswordPayload] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [pwMode, setPWMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { id } = JSON.parse(getToken("currentUser"));

  const handleProfileChange = async (e) => {
    e.preventDefault();
    const updatedPayload = {
      name: payload.name || profileData.name,
      email: payload.email || profileData.email,
    };
    await UserServices.update(id, updatedPayload);
    setProfileData(updatedPayload);
    setEditMode(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const updatedPayload = {
      oldPassword: passwordPayload.oldPassword,
      newPassword: passwordPayload.newPassword,
    };
    try {
      const result = await UserServices.changePassword(updatedPayload);
      setPasswordPayload({ oldPassword: "", newPassword: "" });
      setPWMode(false);
      setSuccessMessage(result?.data?.msg);
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setErrorMessage(error?.response?.data?.msg || "An error occurred");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };
  useEffect(() => {
    const getProfileDetails = async () => {
      const {
        data: { data },
      } = await UserServices.getMyProfile();
      setProfileData(data);
    };
    getProfileDetails();
  }, []);

  return (
    <div className="d-flex justify-content-center p-4">
      <Card style={{ maxWidth: "500px" }} className="authCard w-100">
        <Card.Body>
          {errorMessage && <Notify message={errorMessage} />}
          {successMessage && (
            <Notify variant="success" message={successMessage} />
          )}
          {editMode ? (
            <>
              <h2>Edit User Details</h2>
              <hr />
              <Form onSubmit={handleProfileChange}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={profileData?.name}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, name: e.target.value };
                      })
                    }
                  />
                  <Form.Label className="mt-3">Email</Form.Label>
                  <Form.Control
                    type="email"
                    defaultValue={profileData?.email}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, email: e.target.value };
                      })
                    }
                  />
                </Form.Group>
                <div className="d-flex justify-content-start gap-2">
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="mt-4">
                    Save Changes
                  </Button>
                </div>
              </Form>
            </>
          ) : (
            <>
              <h2>User Details</h2>
              <hr />
              <Card.Title>{profileData.name}</Card.Title>
              <Card.Text>{profileData.email}</Card.Text>
              <div className="d-flex justify-content-start gap-2">
                <Button onClick={() => setEditMode(true)}>
                  Edit Profile
                  <CiEdit />
                </Button>
                {!pwMode && (
                  <Button onClick={() => setPWMode(true)}>
                    Change Password
                    <CiEdit />
                  </Button>
                )}
              </div>
            </>
          )}
          {pwMode && (
            <>
              <h2 className="mt-4">Change Password</h2>
              <hr />
              <Form onSubmit={handleChangePassword}>
                <Form.Group>
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    onChange={(e) =>
                      setPasswordPayload((prev) => {
                        return { ...prev, oldPassword: e.target.value };
                      })
                    }
                  />
                  <Form.Label className="mt-3">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    onChange={(e) =>
                      setPasswordPayload((prev) => {
                        return { ...prev, newPassword: e.target.value };
                      })
                    }
                  />
                </Form.Group>
                <div className="d-flex justify-content-start gap-2 flex-wrap">
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => setPWMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="mt-4"
                    disabled={
                      !passwordPayload.oldPassword ||
                      !passwordPayload.newPassword
                    }
                  >
                    Change Password
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Card.Body>{" "}
      </Card>
    </div>
  );
};

export default Profile;
