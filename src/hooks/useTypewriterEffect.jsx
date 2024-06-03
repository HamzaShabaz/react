import { useState, useEffect } from "react";

export const useTypewriterEffect = (text, speed = 75, delay = 1000) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let typingInterval;
    if (isDeleting) {
      typingInterval = setInterval(() => {
        setDisplayText((prev) => prev.substring(0, prev.length - 1));
        setIndex((prev) => prev - 1);
      }, speed);
    } else {
      typingInterval = setInterval(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
    }

    if (!isDeleting && index === text.length) {
      setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && index === 0) {
      setIsDeleting(false);
    }

    return () => clearInterval(typingInterval);
  }, [isDeleting, index, text, speed, delay]);

  return displayText;
};
