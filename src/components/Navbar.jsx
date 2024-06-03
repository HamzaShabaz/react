import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function Topbar() {
  const { logout } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <div id="topbar">
        <h1>AI / UI Frontend Task</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Tasks</Link>
            </li>
            <li>
              <Link to="/meetings">Meetings</Link>
            </li>
            <li>
              <Link to="/user-profile">User Profile</Link>
            </li>
            <li>
                <button onClick={() => { 
                  logout();
                  navigate('/login');
                 }}>Logout</button>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
