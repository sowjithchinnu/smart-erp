"use client";

export default function CompanyCard({ company, onSelect }) {
  return (
    <div
      onClick={() => onSelect(company)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200 hover:border-blue-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {company.company_name}
          </h3>
          {company.gst_number && (
            <p className="text-sm text-gray-600 mb-1">
              GST: {company.gst_number}
            </p>
          )}
        </div>
        <div className="text-blue-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {company.contact_phone && (
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span>{company.contact_phone}</span>
          </div>
        )}
        {company.state && (
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{company.state}</span>
          </div>
        )}
        {company.financial_year && (
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>FY: {company.financial_year}</span>
          </div>
        )}
        {company.address && (
          <div className="flex items-start gap-2">
            <span>🏠</span>
            <span className="line-clamp-2">{company.address}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Click to open dashboard
        </p>
      </div>
    </div>
  );
}