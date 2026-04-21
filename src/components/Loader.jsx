import { useTheme } from "../context/ThemeContext";

/**
 * Loader component — animated loading spinner
 * @param {Object} props
 * @param {string} [props.text] - Optional loading text
 * @param {boolean} [props.fullScreen] - Full-screen loader mode
 */
function Loader({ text = "Loading...", fullScreen = false }) {
  const { dark } = useTheme();

  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin"></div>
      </div>
      <p className={`text-sm font-medium animate-pulse ${dark ? "text-gray-400" : "text-gray-500"}`}>
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export default Loader;
