import { useState, useRef } from "react";
import {
  Search,
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Store,
  DollarSign,
  SlidersHorizontal,
  X,
} from "lucide-react";
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
  const abortControllerRef = useRef(null);
  const resultsRef = useRef(null);

  const availableSources = ["amazon", "jumia", "2B","elbadr","btech"];

  const handleSourceToggle = (source) => {
    setSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleCancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      toast.error("Search cancelled");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      toast.error("Please enter a search keyword");
      return;
    }

    if (sources.length === 0) {
      toast.error("Please select at least one store");
      return;
    }

    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setProducts([]);

    try {
      const params = {
        keyword: keyword.trim(),
        sort,
        sources: sources.join(","),
      };

      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = isAuthenticated
        ? await scrapeService.scrapeUser(
            params,
            abortControllerRef.current.signal
          )
        : await scrapeService.scrapeGuest(
            params,
            abortControllerRef.current.signal
          );

      setProducts(data.data || []);

      if (data.data?.length === 0) {
        toast.error("No products found. Try different keywords or filters.");
      } else {
        toast.success(`Found ${data.data?.length} products!`);
        scrollToResults();
      }
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        // Search was cancelled, don't show error
        return;
      }
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Search failed. Please try again.";
      toast.error(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container-custom relative z-10 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            {/* Hero Content */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                <Sparkles size={16} className="text-yellow-300" />
                <span>Compare prices across 3+ stores instantly</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Find the Best Deals,
                <span className="block bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-200 bg-clip-text text-transparent">
                  Save More Money
                </span>
              </h1>

              <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
                Smart price comparison across Amazon, Jumia, Btech and more.
                Never overpay for products again.
              </p>
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Input */}
                <div className="relative">
                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={22}
                  />
                  <input
                    type="text"
                    placeholder="What are you looking for? (e.g., iPhone 15, Samsung TV, Nike shoes)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 text-lg focus:outline-none focus:border-primary-500 focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Filters Section - Always Visible */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Sources */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold">
                      <Store size={18} className="text-primary-600" />
                      <span>Select Stores</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSources.map((source) => (
                        <button
                          key={source}
                          type="button"
                          onClick={() => handleSourceToggle(source)}
                          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border-2 ${
                            sources.includes(source)
                              ? "bg-primary-600 border-primary-600 text-white shadow-md"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50"
                          }`}
                        >
                          {source.charAt(0).toUpperCase() + source.slice(1)}
                        </button>
                      ))}
                      <span className="flex items-center text-sm text-gray-400 ml-2">
                        {sources.length === 0
                          ? "0 selected"
                          : `${sources.length} selected`}
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Price & Sort */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold">
                      <SlidersHorizontal
                        size={18}
                        className="text-primary-600"
                      />
                      <span>Filters</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                          EGP
                        </span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full pl-14 pr-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 transition-all"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                          EGP
                        </span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full pl-14 pr-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 transition-all"
                        />
                      </div>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 transition-all cursor-pointer"
                      >
                        <option value="asc">Low → High</option>
                        <option value="des">High → Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-bold text-lg hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Searching stores...</span>
                      </>
                    ) : (
                      <>
                        <Search size={22} />
                        <span>Search & Compare Prices</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                  {loading && (
                    <button
                      type="button"
                      onClick={handleCancelSearch}
                      className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <X size={22} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-primary-100 text-sm">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-300" />
                <span>Real-time prices</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-300" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-300" />
                <span>Best deals first</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {products.length === 0 && !loading && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose PricePointScout?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The smartest way to shop online and save money on every purchase
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 bg-gradient-to-br from-primary-50 to-white rounded-3xl border border-primary-100 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get results from multiple stores in seconds with our optimized
                  scraping engine. No more manual price checking.
                </p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-green-50 to-white rounded-3xl border border-green-100 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Best Prices
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Compare prices across Amazon, Jumia, Btech, and more to find
                  the absolute best deals available online.
                </p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Secure & Private
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your data is safe with us. We never share your information
                  with third parties. Shop with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {(loading || products.length > 0) && (
        <section
          ref={resultsRef}
          className="py-12 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {loading ? "Searching stores..." : "Search Results"}
                </h2>
                {!loading && (
                  <p className="text-gray-600 mt-1">
                    Found{" "}
                    <span className="font-semibold text-primary-600">
                      {products.length}
                    </span>{" "}
                    products for you
                  </p>
                )}
              </div>
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
