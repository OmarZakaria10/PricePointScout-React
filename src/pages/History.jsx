import { useState, useEffect } from "react";
import { History as HistoryIcon, Trash2, Eye, Calendar } from "lucide-react";
import { searchService } from "../services";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const History = () => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [viewingProducts, setViewingProducts] = useState(false);

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    try {
      const data = await searchService.getMySearches();
      console.log("History API response:", data);
      const searchList = data.data?.searches || data.searches || [];
      // Sort by date, latest first
      searchList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSearches(searchList);
    } catch (error) {
      console.error("History fetch error:", error);
      toast.error("Failed to load search history");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSearch = async (searchId) => {
    setViewingProducts(true);
    try {
      const data = await searchService.getSearch(searchId);
      setSelectedSearch(data.data.data);
    } catch (error) {
      toast.error("Failed to load search details");
    } finally {
      setViewingProducts(false);
    }
  };

  const handleDeleteSearch = async (searchId) => {
    if (!window.confirm("Are you sure you want to delete this search?")) return;

    try {
      await searchService.deleteSearch(searchId);
      setSearches(searches.filter((s) => s._id !== searchId));
      if (selectedSearch?._id === searchId) {
        setSelectedSearch(null);
      }
      toast.success("Search deleted");
    } catch (error) {
      toast.error("Failed to delete search");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading search history..." />
      </div>
    );
  }

  const isEmpty = searches.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <HistoryIcon className="text-primary-600" size={36} />
          Search History
        </h1>

        {isEmpty ? (
          <div className="card p-12 text-center">
            <HistoryIcon className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No search history
            </h2>
            <p className="text-gray-600 mb-6">
              Your product searches will appear here
            </p>
            <a href="/" className="btn-primary inline-block">
              Start Searching
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Search List */}
            <div className="lg:col-span-1 space-y-4">
              {searches.map((search) => (
                <div
                  key={search._id}
                  className={`card p-4 cursor-pointer ${
                    selectedSearch?._id === search._id
                      ? "ring-2 ring-primary-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {search.keyword}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{formatDate(search.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {search.resultsCount || 0} products found
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewSearch(search._id)}
                      className="flex-1 px-3 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteSearch(search._id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Products View */}
            <div className="lg:col-span-2">
              {viewingProducts ? (
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner size="lg" text="Loading products..." />
                </div>
              ) : selectedSearch ? (
                <div>
                  <div className="card p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedSearch.keyword}
                    </h2>
                    <p className="text-gray-600">
                      {selectedSearch.results?.length || 0} products found
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {selectedSearch.results?.map((product, index) => (
                      <ProductCard
                        key={`${product.link}-${index}`}
                        product={product}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card p-12 text-center h-full flex items-center justify-center">
                  <div>
                    <Eye className="mx-auto text-gray-400 mb-4" size={64} />
                    <p className="text-gray-600">
                      Select a search to view products
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
