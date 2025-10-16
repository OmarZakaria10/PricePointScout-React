const LoadingSkeleton = ({ type = "card" }) => {
  if (type === "card") {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="skeleton h-48 w-full rounded-xl mb-4"></div>
        <div className="skeleton h-4 w-3/4 rounded mb-3"></div>
        <div className="skeleton h-4 w-1/2 rounded mb-4"></div>
        <div className="skeleton h-10 w-full rounded-xl"></div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="bg-white rounded-xl p-4 shadow-soft mb-3">
        <div className="flex gap-4">
          <div className="skeleton h-20 w-20 rounded-lg"></div>
          <div className="flex-1">
            <div className="skeleton h-4 w-3/4 rounded mb-2"></div>
            <div className="skeleton h-4 w-1/2 rounded mb-2"></div>
            <div className="skeleton h-4 w-1/4 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="skeleton h-20 w-full rounded-xl"></div>;
};

export default LoadingSkeleton;
