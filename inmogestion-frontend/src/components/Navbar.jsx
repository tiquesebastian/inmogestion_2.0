import { NavLink } from "react-router-dom";

export default function Navbar() {
  const navItems = [
    { path: "/", label: "Inicio" },
    { path: "/servicios", label: "Servicios" },
    { path: "/contacto", label: "Contacto" },
  ];

  return (
    <nav className="bg-gray-100 p-4 rounded-md shadow">
      <ul className="flex space-x-6">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
