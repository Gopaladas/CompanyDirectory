import React, { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(10);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    locations: [],
    industries: [],
    companySizes: [],
  });

  useEffect(() => {
    fetch("/companies.json")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setFilteredCompanies(data);
      })
      .catch((err) => console.error("Error loading companies:", err));
  }, []);

  useEffect(() => {
    let filtered = companies;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((company) =>
        Object.values(company).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter((company) =>
        filters.locations.includes(company.location)
      );
    }

    if (filters.industries.length > 0) {
      filtered = filtered.filter((company) =>
        filters.industries.includes(company.industry)
      );
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [searchTerm, companies, filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (filterType, value, isChecked) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: isChecked
        ? [...prev[filterType], value]
        : prev[filterType].filter((item) => item !== value),
    }));
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      locations: [],
      industries: [],
      companySizes: [],
    });
  };

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const indexOfLast = currentPage * companiesPerPage;
  const indexOfFirst = indexOfLast - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-1/3 bg-white border-r border-gray-200 h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 text-sm mt-1">
            Discover companies that match your interests
          </p>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-3 mb-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
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
              )}
            </div>

            <button
              onClick={handleFilterToggle}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {(filters.locations.length > 0 ||
                filters.industries.length > 0) && (
                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {filters.locations.length + filters.industries.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {filteredCompanies.length} companies found
              {searchTerm && <span> for "{searchTerm}"</span>}
            </span>

            {(searchTerm ||
              filters.locations.length > 0 ||
              filters.industries.length > 0) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  handleResetFilters();
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {(filters.locations.length > 0 || filters.industries.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.locations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {location}
                  <button
                    onClick={() =>
                      handleFilterChange("locations", location, false)
                    }
                    className="ml-1 hover:bg-blue-200 rounded-full"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.industries.map((industry) => (
                <span
                  key={industry}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {industry}
                  <button
                    onClick={() =>
                      handleFilterChange("industries", industry, false)
                    }
                    className="ml-1 hover:bg-green-200 rounded-full"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {currentCompanies.length > 0 ? (
            currentCompanies.map((company) => (
              <div
                key={company.id}
                onClick={() => setSelectedCompany(company)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCompany?.id === company.id
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {company.name.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {company.industry}
                    </p>
                    <div className="flex items-center mt-2">
                      <svg
                        className="w-4 h-4 text-gray-400 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-xs text-gray-500">
                        {company.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No companies found
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm ||
                filters.locations.length > 0 ||
                filters.industries.length > 0
                  ? "No results match your search criteria. Try adjusting your filters."
                  : "No companies available."}
              </p>
              {(searchTerm ||
                filters.locations.length > 0 ||
                filters.industries.length > 0) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    handleResetFilters();
                  }}
                  className="mt-3 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {currentCompanies.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-8">
        {selectedCompany ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedCompany.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {selectedCompany.name}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                      {selectedCompany.industry}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-gray-500">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <span>{selectedCompany.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                        <span>1,000+ employees</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {/* <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                    Follow
                  </button> */}
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                    Visit website
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {selectedCompany.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Industry</h3>
                  <p className="text-gray-600">{selectedCompany.industry}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600">{selectedCompany.contact}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                People also viewed
              </h2>
              <div className="space-y-4">
                {companies
                  .filter((company) => company.id !== selectedCompany.id)
                  .slice(0, 3)
                  .map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {company.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {company.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {company.industry}
                          </p>
                        </div>
                      </div>
                      {/* <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        Follow
                      </button> */}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No company selected" : "Select a company"}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "No matching company selected from search results"
                  : "Choose a company from the list to view details"}
              </p>
            </div>
          </div>
        )}
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default CompaniesList;
