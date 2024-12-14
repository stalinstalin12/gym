import { useState, useEffect } from "react";
import LoadingSpinner from "./loading";
import PropTypes from "prop-types";
const LoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Set delay to 1 second

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <LoadingSpinner /> : children;
};
LoadingWrapper.propTypes = { children: PropTypes.node.isRequired, };

export default LoadingWrapper;
