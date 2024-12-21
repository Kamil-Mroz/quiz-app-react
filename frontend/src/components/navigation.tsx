import { useAuth } from "@/AuthProvider";
import { Link, useNavigate } from "@tanstack/react-router";

const Navigation = () => {
  const { authToken, handleLogout } = useAuth();
  const navigate = useNavigate();
  function logout() {
    if (confirm("Are you sure you want to logout?")) {
      handleLogout();
      navigate({ to: "/" });
    }
  }

  return (
    <header className="text-neutral-400 body-font">
      <div className="flex flex-wrap py-5 flex-col md:flex-row items-center">
        <Link to="/" className="text-white">
          Quizzes
        </Link>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-neutral-500 flex flex-wrap items-center gap-4 text-base justify-center ">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="[&.active]:text-blue-400"
          >
            Home
          </Link>
          {authToken && (
            <>
              <Link
                to="/quizzes/own"
                activeOptions={{ exact: true }}
                className="[&.active]:text-blue-400"
              >
                My quizzes
              </Link>
              <Link
                to="/profile"
                activeOptions={{ exact: true }}
                className="[&.active]:text-blue-400"
              >
                Profile
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
          {!authToken && (
            <>
              <Link
                to="/login"
                activeOptions={{ exact: true }}
                className="[&.active]:text-blue-400"
              >
                Login
              </Link>
              <Link
                to="/register"
                activeOptions={{ exact: true }}
                className="[&.active]:text-blue-400"
              >
                Register
              </Link>
            </>
          )}
          <Link
            to="/leaderboard"
            activeOptions={{ exact: true }}
            className="[&.active]:text-blue-400"
          >
            Leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
};
export default Navigation;
