import { useThemeContext } from "../context/ThemeContext";
import {Button} from "react-bootstrap"

const Settings = () => {
  const { toggleTheme } = useThemeContext(); 

  return (
    <div
      className="d-flex justify-content-center items-center"
    >
      <div className="mt-5">
        <h1>Welcome to Movie Mate</h1>
        <div className="d-flex justify-content-evenly items-center">
          <Button onClick={toggleTheme}>Change Theme</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
