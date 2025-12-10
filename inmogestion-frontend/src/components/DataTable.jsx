import React, { useMemo, useState } from 'react';

// Column definition expected:
// { key: 'campo', header: 'Título', sortable?: true, width?: '120px', className?: 'text-right', render?: (row) => ReactNode }
// rowActions?: (row) => ReactNode
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'Sin registros',
  defaultSortKey,
  defaultSortDir = 'asc',
  pageSizeOptions = [10, 25, 50],
  defaultPageSize = 10,
  rowActions,
}) {
  const [sortKey, setSortKey] = useState(defaultSortKey || null);
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);
  const [globalFilter, setGlobalFilter] = useState("");

  // Filtrado global
  const filteredData = useMemo(() => {
    if (!globalFilter.trim()) return data;
    const filter = globalFilter.trim().toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        const value = row[col.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(filter);
      })
    );
  }, [data, globalFilter, columns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find(c => c.key === sortKey);
    if (!col) return filteredData;
    const copy = [...filteredData];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return sortDir === 'asc' ? -1 : 1;
      if (vb == null) return sortDir === 'asc' ? 1 : -1;
      // Numeric
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      // Try parse numbers in strings
      const na = parseFloat(va); const nb = parseFloat(vb);
      if (!isNaN(na) && !isNaN(nb)) {
        return sortDir === 'asc' ? na - nb : nb - na;
      }
      // String compare
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb), 'es')
        : String(vb).localeCompare(String(va), 'es');
    });
    return copy;
  }, [filteredData, sortKey, sortDir, columns]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const toggleSort = (key, sortable) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const onChangePageSize = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Filtro global */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={globalFilter}
          onChange={e => { setGlobalFilter(e.target.value); setPage(1); }}
          placeholder="Buscar en toda la tabla..."
          className="border px-3 py-2 rounded w-full max-w-md text-sm focus:ring focus:ring-blue-200"
        />
        {globalFilter && (
          <button
            type="button"
            onClick={() => setGlobalFilter("")}
            className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
          >Limpiar</button>
        )}
      </div>
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full min-w-max">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white select-none">
            <tr>
              {columns.map(col => {
                const active = sortKey === col.key;
                const icon = !col.sortable ? '' : active ? (sortDir === 'asc' ? '▲' : '▼') : '⇅';
                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={`px-2 sm:px-3 py-2 sm:py-3 font-semibold text-xs sm:text-sm ${col.className || 'text-left'} ${col.sortable ? 'cursor-pointer group' : ''}`}
                    onClick={() => toggleSort(col.key, col.sortable)}
                    title={col.sortable ? 'Ordenar' : undefined}
                  >
                    <div className="flex items-center gap-1">
                      <span className="truncate">{col.header}</span>
                      {col.sortable && (
                        <span className={`text-[10px] opacity-70 group-hover:opacity-100 transition`}>{icon}</span>
                      )}
                    </div>
                  </th>
                );
              })}
              {rowActions && (
                <th className="px-2 sm:px-3 py-2 sm:py-3 font-semibold text-xs sm:text-sm text-center">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.map((row, idx) => (
              <tr key={row.id || idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}> 
                {columns.map(col => (
                  <td key={col.key} className={`px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm ${col.className || ''}`}>
                    {col.render ? col.render(row) : (
                      <span className="truncate text-gray-700">
                        {typeof row[col.key] === 'number' ? row[col.key] : (row[col.key] || '—')}
                      </span>
                    )}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-2 sm:px-3 py-2 sm:py-3">
                    <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                      {rowActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td className="p-4 sm:p-8 text-center text-gray-500 text-sm" colSpan={columns.length + (rowActions ? 1 : 0)}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <label className="text-gray-600">Filas por página:</label>
            <select
              value={pageSize}
              onChange={onChangePageSize}
              className="border rounded px-2 py-1"
            >
              {pageSizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <span className="text-gray-500 hidden sm:inline">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded font-semibold"
            >Anterior</button>
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline">Página</span>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={currentPage}
                onChange={e => setPage(() => {
                  const val = parseInt(e.target.value) || 1;
                  return Math.min(Math.max(1, val), pageCount);
                })}
                className="w-12 sm:w-16 border rounded px-2 py-1 text-center"
              />
              <span>de {pageCount}</span>
            </div>
            <button
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
              className="px-2 sm:px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded font-semibold"
            >Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
}
