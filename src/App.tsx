import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/login.tsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice.ts";
import { getAccountAPI } from "./services/auth.service.ts";
import { Center, Spinner } from "@chakra-ui/react";
import { ResponseType } from "./types/response.type.ts";
import DashboardPage from "./pages/admin/dashboard.tsx";
import UserPage from "./pages/admin/user.tsx";
import ErrorPage from "./pages/error/error.tsx";
import AdminLayout from "./components/layout/admin.tsx";
import RegisterPage from "./pages/register/register.tsx";
import HomePage from "./pages/home/home.tsx";
import ClientLayout from "./components/layout/client.tsx";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const res: ResponseType = await getAccountAPI();
      setLoading(false);
      if (res && res.data) {
        dispatch(doGetAccountAction(res.data));
      } else {
        console.error(res.message);
      }
    };
    if (!["/login", "/register"].includes(window.location.pathname)) {
      fetchAccount();
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  const AdminPage = () => {
    if (!user._id) {
      return <Navigate to="/login" replace />;
    }
    if (user.role !== "ADMIN") {
      return <ErrorPage />;
    }
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  };

  const ClientPage = () => {
    return (
      <ClientLayout>
        <Outlet />
      </ClientLayout>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ClientPage />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminPage />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <DashboardPage />
        },
        {
          path: "user",
          element: <UserPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return (
    <>
      {loading ? (
        <Center minH={'100vh'}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Center>
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

export default App;
