import { Tag } from "antd";
import { TableRowSortOrder, Text } from "flipper";
import React, { useCallback, useMemo } from "react";
import type { Query } from "react-query";

export function getQueryStatusLabel(query: Query) {
  return query.state.isFetching
    ? "fetching"
    : !getObserversCount(query)
    ? "inactive"
    : getIsStale(query)
    ? "stale"
    : "fresh";
}

export const queryStatusColors = {
  inactive: "#3f4e60",
  fresh: "#00ab52",
  fetching: "#006bff",
  stale: "#ffb200",
};

export function getQueryStatusColor(query: Query) {
  return query.state.isFetching
    ? queryStatusColors.fetching
    : getIsStale(query)
    ? queryStatusColors.stale
    : !getObserversCount(query)
    ? queryStatusColors.inactive
    : queryStatusColors.fresh;
}

function getIsStale(query: Query) {
  return (
    query.state.isInvalidated ||
    !query.state.dataUpdatedAt ||
    query.observers?.some((observer) => observer.currentResult.isStale)
  );
}

export function getObserversCount(query: Query) {
  return query.observers?.length ?? 0;
}

export function getLastUpdatedAtString(query: Query) {
  return query.state.dataUpdatedAt
    ? new Date(query.state.dataUpdatedAt).toLocaleTimeString()
    : "–";
}

export function useQueryStatuses(queries: Query[]) {
  const hasFresh = useMemo(
    () =>
      queries.filter((query) => getQueryStatusLabel(query) === "fresh").length,
    [queries]
  );
  const hasFetching = useMemo(
    () =>
      queries.filter((query) => getQueryStatusLabel(query) === "fetching")
        .length,
    [queries]
  );
  const hasStale = useMemo(
    () =>
      queries.filter((query) => getQueryStatusLabel(query) === "stale").length,
    [queries]
  );
  const hasInactive = useMemo(
    () =>
      queries.filter((query) => getQueryStatusLabel(query) === "inactive")
        .length,
    [queries]
  );

  return {
    hasFresh,
    hasFetching,
    hasStale,
    hasInactive,
  };
}

type QueryTableColumn = {
  id: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  getValue: (row: Query) => React.ReactNode;
  default?: boolean;
  size?: number;
  compareFn?: (a: Query, b: Query) => number;
};

export const queryTableColumns: Record<string, QueryTableColumn> = {
  lastUpdated: {
    id: "lastUpdated",
    title: "Last Updated",
    sortable: true,
    compareFn: (a, b) => a.state.dataUpdatedAt - b.state.dataUpdatedAt,
    getValue: (query) => <Text>{getLastUpdatedAtString(query)}</Text>,
    default: true,
    size: 150,
  },
  queryHash: {
    id: "queryHash",
    title: "Query Hash",
    sortable: true,
    compareFn: (a, b) => a.queryHash.localeCompare(b.queryHash),
    getValue: (query) => <Text>{query.queryHash}</Text>,
    default: true,
    size: 275,
  },
  observerCount: {
    id: "observerCount",
    title: "Observer Count",
    sortable: true,
    compareFn: (a, b) => getObserversCount(a) - getObserversCount(b),
    getValue: (query) => <Text>{getObserversCount(query)}</Text>,
    size: 130,
  },
  status: {
    id: "status",
    title: "Status",
    sortable: true,
    compareFn: (a, b) =>
      getQueryStatusLabel(a).localeCompare(getQueryStatusLabel(b)),
    filterable: true,
    getValue: (query) => (
      <Tag color={getQueryStatusColor(query)} style={{ marginRight: 0 }}>
        {getQueryStatusLabel(query)}
      </Tag>
    ),
    default: true,
    size: 130,
  },
  updateCount: {
    id: "updateCount",
    title: "Update Count",
    sortable: true,
    compareFn: (a, b) => a.state.dataUpdateCount - b.state.dataUpdateCount,
    getValue: (query) => <Text>{query.state.dataUpdateCount}</Text>,
    size: 100,
  },
  cacheTime: {
    id: "cacheTime",
    title: "Cache Time (ms)",
    sortable: true,
    compareFn: (a, b) => a.cacheTime - b.cacheTime,
    getValue: (query) => <Text>{query.cacheTime}</Text>,
    size: 130,
  },
  staleTime: {
    id: "staleTime",
    title: "Stale Time (ms)",
    sortable: true,
    compareFn: (a, b) => a.options.staleTime - b.options.staleTime,
    getValue: (query) => <Text>{query.options.staleTime}</Text>,
    size: 130,
  },
};

export const defaultVisibleColumns = Object.values(queryTableColumns).reduce(
  (acc, columnDef) => {
    acc[columnDef.id] = !!columnDef.default;
    return acc;
  },
  {} as Record<string, boolean>
);

export function useSortedQueries(
  queries: Query[],
  sortOrder: TableRowSortOrder | undefined
) {
  return useMemo(() => {
    if (!sortOrder) {
      return queries;
    }

    const compareFn = queryTableColumns[sortOrder.key].compareFn;

    if (!compareFn) {
      return queries;
    }

    const sorted = [...queries].sort(compareFn);

    if (sortOrder.direction === "down") {
      sorted.reverse();
    }

    return sorted;
  }, [sortOrder, queries]);
}

export function useColumns(columnVisibility: Record<string, boolean>) {
  const columns = useMemo(() => {
    return Object.values(queryTableColumns).reduce((acc, columnDef) => {
      if (columnVisibility[columnDef.id]) {
        acc[columnDef.id] = {
          value: columnDef.title,
          sortable: !!columnDef.sortable,
        };
      }
      return acc;
    }, {} as Record<string, { value: string; sortable: boolean }>);
  }, [columnVisibility]);

  const columnOrder = useMemo(() => {
    return Object.values(queryTableColumns).reduce((acc, columnDef) => {
      if (columnVisibility[columnDef.id]) {
        acc.push({ key: columnDef.id, visible: true });
      }
      return acc;
    }, [] as Array<{ key: string; visible: boolean }>);
  }, [columnVisibility]);

  const columnSizes = useMemo(() => {
    return Object.values(queryTableColumns).reduce((acc, columnDef) => {
      if (columnVisibility[columnDef.id] && columnDef.size) {
        acc[columnDef.id] = columnDef.size;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [columnVisibility]);

  const buildRow = useCallback(
    (query: Query) => {
      const computedColumns = {} as Record<
        string,
        { value: React.ReactNode; isFilterable: boolean }
      >;

      for (const key in columns) {
        computedColumns[key] = {
          value: queryTableColumns[key].getValue(query),
          isFilterable: !!queryTableColumns[key].filterable,
        };
      }

      return {
        key: query.queryHash,
        columns: computedColumns,
      };
    },
    [columns]
  );

  return {
    columns,
    columnOrder,
    columnSizes,
    buildRow,
  };
}
