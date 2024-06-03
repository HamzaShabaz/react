import {
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom";

import ErrorPage from "./components/ErrorPage";
import { Login } from "./pages/auth/Login";
import Root from "./components/Navbar"
import { Tasks } from "./pages/tasks/Tasks";
import { UserProfile } from "./pages/profile/UserProfile";
import { Meetings } from "./pages/Meetings/Meetings";

export default function RouteProvider() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            children: [
                {
                    path: "/",
                    element: <Tasks />,
                },
                {
                    path: "/meetings",
                    element: <Meetings />,
                },
                {
                    path: "/user-profile",
                    element: <UserProfile />,
                },
                {
                    path: "/login",
                    element: <Login />,
                },
            ],
        },
        {
            path: "*",
            element: <ErrorPage />,
        }
    ]);
    
    return (
        <RouterProvider router={router} />
    );
}