export const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
    >
      {children}
    </button>
  );
};