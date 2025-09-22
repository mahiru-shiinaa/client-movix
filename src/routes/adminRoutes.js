// src/routes/adminRoutes.js
import { lazy, Suspense } from "react";
import LayoutAdmin from "../layouts/LayoutAdmin";
import PrivateRoutes from "./PrivateRoutes";
import Loading from "../components/Loading";

// 👈 Lazy load các component
const DashBoardPage = lazy(() => import("../pages/admin/Dashboard"));
const FilmListPage = lazy(() => import("../pages/admin/films/FilmListPage"));
const FilmCreatePage = lazy(() => import("../pages/admin/films/FilmCreatePage"));
const FilmEditPage = lazy(() => import("../pages/admin/films/FilmEditPage"));
const FilmDetailPage = lazy(() => import("../pages/admin/films/FilmDetailPage"));
const CinemaListPage = lazy(() => import("../pages/admin/cinemas/CinemaListPage"));
const CinemaDetailPage = lazy(() => import("../pages/admin/cinemas/CinemaDetailPage"));
const CinemaCreatePage = lazy(() => import("../pages/admin/cinemas/CinemaCreatePage"));
const CinemaEditPage = lazy(() => import("../pages/admin/cinemas/CinemaEditPage"));

// 👈 Wrapper component với Suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<Loading tip="Đang tải trang..." />}>
    {children}
  </Suspense>
);

const adminRoutes = [
  {
    element: <PrivateRoutes allowedRoles={["admin"]} redirectPath="/admin/auth/login" />,
    children: [
      {
        path: "/admin",
        element: <LayoutAdmin />,
        children: [
          { 
            index: true, 
            element: <LazyWrapper><DashBoardPage /></LazyWrapper> 
          },
          { 
            path: "dashboard", 
            element: <LazyWrapper><DashBoardPage /></LazyWrapper> 
          },

          // Films
          { 
            path: "films", 
            element: <LazyWrapper><FilmListPage /></LazyWrapper> 
          },
          { 
            path: "films/:id", 
            element: <LazyWrapper><FilmDetailPage /></LazyWrapper> 
          },
          { 
            path: "films/create", 
            element: <LazyWrapper><FilmCreatePage /></LazyWrapper> 
          },
          { 
            path: "films/edit/:id", 
            element: <LazyWrapper><FilmEditPage /></LazyWrapper> 
          },

          // Cinemas
          { 
            path: "cinemas", 
            element: <LazyWrapper><CinemaListPage /></LazyWrapper> 
          },
          { 
            path: "cinemas/:id", 
            element: <LazyWrapper><CinemaDetailPage /></LazyWrapper> 
          },
          { 
            path: "cinemas/create", 
            element: <LazyWrapper><CinemaCreatePage /></LazyWrapper> 
          },
          { 
            path: "cinemas/edit/:id", 
            element: <LazyWrapper><CinemaEditPage /></LazyWrapper> 
          },
        ],
      },
    ],
  },
];

export default adminRoutes;