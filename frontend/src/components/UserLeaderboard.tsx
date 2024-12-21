type UserLeaderboardProps = {
  index: number;
  user: { username: string; totalSolvedQuizzes: number };
};
const UserLeaderboard = ({ user, index }: UserLeaderboardProps) => {
  return (
    <div className="row">
      <p>{index + 1}</p>
      <p>{user.username}</p>
      <p>{user.totalSolvedQuizzes}</p>
    </div>
  );
};
export default UserLeaderboard;
