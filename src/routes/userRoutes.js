import LayoutUser from "../layouts/LayoutUser";
import PrivateRoutes from "./PrivateRoutes";


const userRoutes = [
  {
    element: <PrivateRoutes allowedRoles={["user"]} redirectPath="/auth/login" />,
    children: [
      {
        element: <LayoutUser />,
        children: [
          // { path: "profile", element: <ProfilePage /> },
          // { path: "my-tickets", element: <MyTicketsPage /> },
          // { path: "payment", element: <PaymentPage /> },
          // { path: "carts", element: <CartPage /> },
        ],
      },
    ],
  },
];

export default userRoutes;
