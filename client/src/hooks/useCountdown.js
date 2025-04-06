import { useEffect, useState } from "react";

/**
 *
 * @param {number} from czas w sekdundach, od której sekundy rozpoczyna się odliczanie
 */
export const useCountdown = (from) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const handler = setInterval(() => {
      setCount((count) => {
        if (count == 0) return count;
        return count - 1;
      });
    }, 1000); // odbywa się co sekunde

    return () => clearInterval(handler);
  }, []);

  return count;
};
