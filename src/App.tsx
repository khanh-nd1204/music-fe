import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/home/home.tsx";
import LoginPage from "./pages/login/login.tsx";
import Register from "./pages/register/register.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage/>,
    },
    {
      path: "/login",
      element: <LoginPage/>,
    },
    {
      path: "/register",
      element: <Register/>,
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
