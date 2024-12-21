import { useEffect, useState } from "react";

type CountdownProps = {
  initialTime: number;
  onTimeUp: () => void;
};

const Countdown = ({ initialTime, onTimeUp }: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime * 60);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="text-right text-red-500 font-semibold mb-4">
      Time remaining: {formatTime(timeRemaining)}
    </div>
  );
};
export default Countdown;
