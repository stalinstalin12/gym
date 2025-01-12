import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

export default function NoData({ message, subMessage }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-white p-6">
      <div className="bg-green-50 rounded-full px-10 py-9">
        <FontAwesomeIcon
          icon={faFolderOpen}
          className="text-red-700 text-6xl mb-4"
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mt-6">{message}</h2>
      <p className="text-gray-600 text-md mt-2">{subMessage}</p>
      
    </div>
  );
}

// Default Props
NoData.defaultProps = {
  message: "No data found",
  subMessage: "Try adding some items or come back later!",
};

// PropTypes Validation
NoData.propTypes = {
  message: PropTypes.string,
  subMessage: PropTypes.string,
};
