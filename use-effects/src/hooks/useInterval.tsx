import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: number | null) => {
  useEffect(() => {
    if (delay !== null) {
      // Register Interval on component mount
      let intervalID = setInterval(callback, delay);

      // Unregister Interval on component unmount
      return () => clearInterval(intervalID);
    }
  }, [delay, callback]);
};

export default useInterval;
