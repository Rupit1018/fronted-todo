import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "../layout/Publiclayout";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import Home from "../views/Home";
import Privatelayout from "../layout/Privatelayout";
import OrgPage from "../pages/org/OrgPage";
import TodoPage from "../pages/todo/TodoPage";
import UserProfilePage from "../pages/user/UserProfilePage";
import FogotPasswordPage from "../pages/auth/FogotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import CreateGroupPage from "../pages/org/CreateGroupPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/forgot-password", element: <FogotPasswordPage /> },
      {path:'/reset-password',element:<ResetPasswordPage />},
    ],
  },
  {
    element: <Privatelayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/org", element: <OrgPage /> },
      { path: "/todo", element: <TodoPage /> },
      { path: "/profile", element: <UserProfilePage /> },
     { path: "/creategroup/:orgId", element: <CreateGroupPage /> }
    ],
  },
]);

export default router;
