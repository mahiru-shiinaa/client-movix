import LayoutUser from "../layouts/LayoutUser";
import LoginAdmin from "../pages/admin/Login";
import LogoutPage from "../pages/common/LogoutPage";
import NotFound from "../pages/common/NotFound";
import Unauthorized from "../pages/common/Unauthorized";


const commonRoutes = [
  {
    path: "/",
    element: <LayoutUser />,
    children: [
      // { index: true, element: <HomePage /> },
      // { path: "auth/login", element: <LoginPage /> },
      // { path: "auth/register", element: <RegisterPage /> },
       
      // { path: "search", element: <SearchPage /> },
      // { path: "films/:id", element: <FilmDetailPage /> },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "auth/login",
        element: <LoginAdmin />
      }
    ]
  },
   // 👈 Error pages - không cần layout
  {
    path: "/unauthorized",
    element: <Unauthorized />  // 403 Forbidden
  },
  {
    path: "/404",
    element: <NotFound />      // 404 Not Found
  },
  // 👈 Catch-all route - phải đặt cuối cùng
  {
    path: "*",
    element: <NotFound />      // Bất kỳ route nào không match sẽ hiển thị 404
  },
  
    { path: "auth/logout", element: <LogoutPage /> },
  
];

export default commonRoutes;
