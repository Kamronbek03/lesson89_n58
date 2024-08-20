import { createBrowserRouter } from "react-router-dom";
import { paths } from "./paths";
import { Spin } from "antd";
import { Suspense, lazy } from "react";

const withSuspense = (Component: React.LazyExoticComponent<React.FC>) => {
  return (props: any) => (
    <Suspense fallback={<Spin fullscreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const Layout = withSuspense(lazy(() => import("./layout/Layout")));
const Dashboard = withSuspense(
  lazy(() => import("./pages/dashboard/Dashboard"))
);
const Products = withSuspense(lazy(() => import("./pages/products/Products")));
const Users = withSuspense(lazy(() => import("./pages/users/Users")));
const Profile = withSuspense(lazy(() => import("./pages/profile/Profile")));
const Login = withSuspense(lazy(() => import("./pages/login/Login")));
const Register = withSuspense(lazy(() => import("./pages/register/Register")));
const NotFound = withSuspense(lazy(() => import("./pages/not-found/NotFound")));

export const routes = createBrowserRouter([
  {
    path: paths.HOME,
    element: <Layout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: paths.PRODUCTS, element: <Products /> },
      { path: paths.USERS, element: <Users /> },
      { path: paths.PROFILE, element: <Profile /> },
    ],
  },
  { path: paths.LOGIN, element: <Login /> },
  { path: paths.REGISTER, element: <Register /> },
  { path: paths.NOT_FOUND, element: <NotFound /> },
]);
