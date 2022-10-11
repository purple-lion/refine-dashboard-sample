import React from "react";
import {
  useMenu,
  useNavigation,
  LayoutProps,
  useLogout,
} from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";

const { Link } = routerProvider;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { menuItems } = useMenu();
  const { push } = useNavigation();
  const { mutate: logout } = useLogout();
  return (
    <>
      <div>Layout</div>
      <button
        onClick={() => {
          logout();
        }}
      >
        logout
      </button>
      <pre>{JSON.stringify({ menuItems }, null, 2)}</pre>
      <ul>
        {menuItems.map(({ name, label, icon, route }) => (
          <li key={name}>
            <a onClick={() => push(route || "")}>
              {icon}
              <span>{label ?? name}</span>
            </a>
          </li>
        ))}
      </ul>

      <div>{children}</div>
    </>
  );
};
