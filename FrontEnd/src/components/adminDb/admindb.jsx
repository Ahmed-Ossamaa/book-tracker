//------------------------ for admin dashboard page ------------------------ 

const DashboardButton = ({ onClick, icon, title, subtitle, value, isSmall }) => (
    <button
        onClick={onClick}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
    >
        <div className="flex items-center justify-between mb-3">
            {icon}
            <span
                className={`${isSmall ? 'text-sm font-semibold text-primary' : 'text-2xl font-bold text-gray-900'
                    }`}
            >
                {value}
            </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
    </button>
);

const BookCard = ({ book, onClick }) => (
    <div
        onClick={onClick}
        className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
    >
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">{book.author}</p>
        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {book.category}
        </span>
    </div>
);

const OverviewRow = ({ label, value, noBorder }) => (
    <div
        className={`flex justify-between items-center py-2 ${noBorder ? '' : 'border-b border-gray-100'
            }`}
    >
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
    </div>
);

export { DashboardButton, BookCard, OverviewRow };