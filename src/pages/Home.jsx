import { useState } from "react";
import { Search, TrendingUp, Zap, Shield, Filter } from "lucide-react";
import { scrapeService } from "../services";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import toast from "react-hot-toast";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [sources, setSources] = useState([]);
  const [sort, setSort] = useState("asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const availableSources = ["amazon", "jumia", "noon", "elbadr"];

  const handleSourceToggle = (source) => {
    setSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      toast.error("Please enter a search keyword");
      return;
    }

    setLoading(true);
    setProducts([]);

    try {
      const params = {
        keyword: keyword.trim(),
        sort,
      };

      if (sources.length > 0) {
        params.sources = sources.join(",");
      }

      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = isAuthenticated
        ? await scrapeService.scrapeUser(params)
        : await scrapeService.scrapeGuest(params);

      setProducts(data.data || []);

      if (data.data?.length === 0) {
        toast.error("No products found. Try different keywords or filters.");
      } else {
        toast.success(`Found ${data.data?.length} products!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-pink-500 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the Best Deals, Instantly
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-primary-50">
              Compare prices across multiple stores and save money on every
              purchase
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search for products... (e.g., laptop, phone, headphones)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg hover:shadow-hover transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Search size={24} />
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-white/90 hover:text-white flex items-center gap-2 mx-auto"
              >
                <Filter size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {/* Filters */}
              {showFilters && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                  {/* Sources */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Sources
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {availableSources.map((source) => (
                        <button
                          key={source}
                          type="button"
                          onClick={() => handleSourceToggle(source)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            sources.includes(source)
                              ? "bg-white text-primary-600"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                        >
                          {source.charAt(0).toUpperCase() + source.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range & Sort */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Min Price
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Max Price
                      </label>
                      <input
                        type="number"
                        placeholder="10000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Sort By
                      </label>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-gray-900"
                      >
                        <option value="asc">Price: Low to High</option>
                        <option value="des">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Features */}
      {products.length === 0 && !loading && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose PricePointScout?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-gray-600">
                  Get results from multiple stores in seconds with our optimized
                  scraping engine
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
                <p className="text-gray-600">
                  Compare prices across Amazon, Jumia, Noon, and more to find
                  the best deals
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                <p className="text-gray-600">
                  Your data is safe with us. We never share your information
                  with third parties
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {(loading || products.length > 0) && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {loading ? "Searching..." : `Found ${products.length} Products`}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <LoadingSkeleton key={i} type="card" />
                  ))
                : products.map((product, index) => (
                    <ProductCard
                      key={`${product.link}-${index}`}
                      product={product}
                    />
                  ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
