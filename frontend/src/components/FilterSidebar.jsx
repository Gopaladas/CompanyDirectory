import React from "react";

const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const locations = [
    "Tokyo, Japan",
    "Bangalore, India",
    "New York, USA",
    "London, UK",
    "Berlin, Germany",
    "Singapore",
    "Sydney, Australia",
  ];
  const industries = [
    "IT Services",
    "Consulting",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Technology",
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 border-l border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Location
              </h3>
              <div className="space-y-2">
                {locations.map((location) => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.locations.includes(location)}
                      onChange={(e) =>
                        onFilterChange("locations", location, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {location}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Industry
              </h3>
              <div className="space-y-2">
                {industries.map((industry) => (
                  <label key={industry} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.industries.includes(industry)}
                      onChange={(e) =>
                        onFilterChange("industries", industry, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {industry}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 space-y-3">
            <button
              onClick={onApplyFilters}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={onResetFilters}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
