import UserLeaderboard from "@/components/UserLeaderboard";
import { fetchLeaderboard } from "@/services/quizzesService";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/leaderboard/")({
  component: Leaderboard,
  loader: () => fetchLeaderboard(),
  pendingComponent: () => <div>Loading...</div>,
});

function Leaderboard() {
  const leaderboard = Route.useLoaderData();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-neutral-800 rounded-lg shadow-l">
      <h1 className="text-3xl font-extrabold text-neutral-100 mb-10 text-center">
        Leaderboard
      </h1>
      {leaderboard.length > 0 && (
        <div>
          <div className="row">
            <p>Lp</p>
            <p>Username</p>
            <p>Total solved quizzes</p>
          </div>
          {leaderboard.map((user, index) => (
            <UserLeaderboard user={user} index={index} key={index} />
          ))}
        </div>
      )}{" "}
      {(!leaderboard || leaderboard.length <= 0) && (
        <div>
          <p className="loading text-center">No user has completed a quiz.</p>
        </div>
      )}
    </div>
  );
}
