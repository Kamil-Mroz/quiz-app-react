type AchievementsProps = {
  achievements: {
    name: string;
    description: string;
    url: string;
  }[];
};

const Achievements = ({ achievements }: AchievementsProps) => {
  const IMAGE_URL = "http://localhost:3000/images/";
  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-600 mt-6">
      <h2 className="text-xl font-semibold text-neutral-100 mb-4 text-center">
        Achievements
      </h2>
      <div className="grid grid-cols-3 place-items-center">
        {achievements.map((achievement) => (
          <div className="flex flex-col items-center" key={achievement.name}>
            <img
              title={achievement.name}
              src={IMAGE_URL + achievement.url}
              className="w-32 h-32 rounded-lg shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300 block"
            />
            <p className="font-medium text-neutral-500">{achievement.name}</p>
            <p className="text-neutral-100">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Achievements;
