import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const Notification = ({ message, subMessage, color, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", damping: 30, stiffness: 150 }}
        className="flex "
      >
        <div className="flex mt-16">
          <div className="m-auto">
            <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
              <div className="flex flex-row">
                <div className="px-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 1792 1792"
                    fill={color}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
                  </svg>
                </div>
                <div className="ml-2 mr-6">
                  <span className="font-semibold">{message}</span>
                  <span className="block text-gray-500">{subMessage}</span>
                </div>
                <button onClick={onClose} className="text-gray-700 text-lg">
                  &times;
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  subMessage: PropTypes.string.isRequired,
  color: PropTypes.string,
  onClose: PropTypes.func.isRequired, // Added this line
};

Notification.defaultProps = {
  color: "#44C997",
};

export default Notification;
