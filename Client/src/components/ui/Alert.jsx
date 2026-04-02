const Alert = ({ type = 'error', message }) => {
  const styles = {
    error: 'bg-red-50 text-red-700 border border-red-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
  };

  return (
    <div className={`p-3 rounded-lg text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};

export default Alert;