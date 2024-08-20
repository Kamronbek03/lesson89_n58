import { RouterProvider } from "react-router-dom";
import { routes } from "../../routes";

const Root: React.FC = () => {
  return <RouterProvider router={routes} />;
};

export default Root;
