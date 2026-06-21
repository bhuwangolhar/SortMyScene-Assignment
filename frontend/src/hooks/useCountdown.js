import { useEffect, useState } from "react";

export default function useCountdown(targetTime) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining =
                new Date(targetTime).getTime() -
                Date.now();

            setTimeLeft(
                Math.max(0, remaining)
            );
        }, 1000);

        return () =>
            clearInterval(interval);
    }, [targetTime]);

    return timeLeft;
}