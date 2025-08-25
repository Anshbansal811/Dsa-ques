import { useState } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { User as UserType } from "../types";

interface HeaderProps {
  onMenuClick: () => void;
  user: UserType | null;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, user }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-x-3 text-sm font-semibold leading-6 text-gray-900"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden lg:flex lg:items-center">
                {user?.name}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <div className="px-3 py-1 text-sm text-gray-500 border-b border-gray-100">
                  {user?.email}
                </div>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-x-2 px-3 py-2 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
