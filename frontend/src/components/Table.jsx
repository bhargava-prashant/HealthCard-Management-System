const Table = ({ headers, data, renderRow, emptyMessage = 'No data available' }) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="table-container overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {safeData.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            safeData.map((row, index) => renderRow(row, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
