import {
  BarChart3,
  FileSearch,
  LogOut,
  Menu,
  Sparkles,
  User,
  X,
} from "lucide-react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  useState,
} from "react";

import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

function getLinkClass({
  isActive,
}: {
  isActive: boolean;
}) {
  const baseClass =
    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-200";

  return isActive
    ? `${baseClass} bg-neutral-900 text-neutral-50 shadow-sm`
    : `${baseClass} text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-950`;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const { user, signOut } = useAuth();
  const { language, setLanguage , t } =
    useLanguage();

  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-300/70 bg-neutral-100/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          to="/dashboard"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 text-neutral-50 shadow-md transition-transform group-hover:-rotate-3 group-hover:scale-105">
            <Sparkles size={19} />
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight text-neutral-950">
              RESUME.AI
            </p>

            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              Smart career analysis
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/dashboard"
            className={getLinkClass}
          >
            <BarChart3 size={16} />
            {t.navbar.dashboard}
          </NavLink>

          <NavLink
            to="/analyze"
            className={getLinkClass}
          >
            <FileSearch size={16} />
            {t.navbar.analyze}
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center rounded-xl border border-neutral-300 bg-neutral-200 p-1">
  <button
    type="button"
    onClick={() => setLanguage("en")}
    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
      language === "en"
        ? "bg-neutral-950 text-neutral-50 shadow-sm"
        : "text-neutral-500 hover:text-neutral-950"
    }`}
  >
    EN
  </button>

  <button
    type="button"
    onClick={() => setLanguage("bn")}
    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
      language === "bn"
        ? "bg-neutral-950 text-neutral-50 shadow-sm"
        : "text-neutral-500 hover:text-neutral-950"
    }`}
  >
    BN
  </button>
</div>

          <div className="flex max-w-52 items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2">
            <User
              size={15}
              className="shrink-0 text-neutral-500"
            />

            <span className="truncate text-xs text-neutral-600">
              {user?.email}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-600 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50"
          >
            <LogOut size={15} />
            {t.navbar.signOut}
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (current) => !current,
            )
          }
          className="rounded-xl border border-neutral-300 p-2 text-neutral-800 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-neutral-300 bg-neutral-100 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/dashboard"
              className={getLinkClass}
              onClick={() =>
                setMobileMenuOpen(false)
              }
            >
              <BarChart3 size={16} />
              {t.navbar.dashboard}
            </NavLink>

            <NavLink
              to="/analyze"
              className={getLinkClass}
              onClick={() =>
                setMobileMenuOpen(false)
              }
            >
              <FileSearch size={16} />
              {t.navbar.analyzeResume}
            </NavLink>

            <div className="flex items-center rounded-xl border border-neutral-300 bg-neutral-200 p-1">
  <button
    type="button"
    onClick={() => setLanguage("en")}
    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
      language === "en"
        ? "bg-neutral-950 text-neutral-50 shadow-sm"
        : "text-neutral-500 hover:text-neutral-950"
    }`}
  >
    EN
  </button>

  <button
    type="button"
    onClick={() => setLanguage("bn")}
    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
      language === "bn"
        ? "bg-neutral-950 text-neutral-50 shadow-sm"
        : "text-neutral-500 hover:text-neutral-950"
    }`}
  >
    BN
  </button>
</div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-700"
            >
              <LogOut size={16} />
              {t.navbar.signOut}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}