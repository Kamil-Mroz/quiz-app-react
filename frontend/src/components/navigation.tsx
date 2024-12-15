import { Link } from "@tanstack/react-router";

const Navigation = () => {
  return (
    <header className="text-neutral-400 body-font">
      <div className="flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link to="/" className="text-white">
          Quizzes
        </Link>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-neutral-500 flex flex-wrap items-center text-base justify-center">
          <Link to="/" activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/quizzes/own" activeOptions={{ exact: true }}>
            My quizzes
          </Link>
          <Link to="/profile" activeOptions={{ exact: true }}>
            Profile
          </Link>
          <Link to="/" activeOptions={{ exact: true }}>
            Logout
          </Link>

          <Link to="/" activeOptions={{ exact: true }}>
            Login
          </Link>
          <Link to="/" activeOptions={{ exact: true }}>
            Register
          </Link>
          <Link to="/leaderboard" activeOptions={{ exact: true }}>
            Leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
};
export default Navigation;
