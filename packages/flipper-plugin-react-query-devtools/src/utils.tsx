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

export function useSortedQueries(
  queries: Query[],
  sortOrder: TableRowSortOrder | undefined
) {
  return useMemo(() => {
    if (!sortOrder) {
      return queries;
    }

    const sorted = [...queries];

    if (sortOrder.key === "lastUpdated") {
      sorted.sort((a, b) => a.state.dataUpdatedAt - b.state.dataUpdatedAt);
    }

    if (sortOrder.key === "queryHash") {
      sorted.sort((a, b) => a.queryHash.localeCompare(b.queryHash));
    }

    if (sortOrder.key === "status") {
      sorted.sort((a, b) =>
        getQueryStatusLabel(a).localeCompare(getQueryStatusLabel(b))
      );
    }

    if (sortOrder.direction === "down") {
      sorted.reverse();
    }

    return sorted;
  }, [sortOrder, queries]);
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
};

export const queryTableColumns: Record<string, QueryTableColumn> = {
  lastUpdated: {
    id: "lastUpdated",
    title: "Last Updated",
    sortable: true,
    getValue: (query) => <Text>{getLastUpdatedAtString(query)}</Text>,
    default: true,
    size: 150,
  },
  queryHash: {
    id: "queryHash",
    title: "Query Hash",
    sortable: true,
    getValue: (query) => <Text>{query.queryHash}</Text>,
    default: true,
  },
  observerCount: {
    id: "observerCount",
    title: "Observer Count",
    sortable: true,
    getValue: (query) => <Text>{getObserversCount(query)}</Text>,
  },
  status: {
    id: "status",
    title: "Status",
    sortable: true,
    filterable: true,
    getValue: (query) => (
      <Tag color={getQueryStatusColor(query)} style={{ marginRight: 0 }}>
        {getQueryStatusLabel(query)}
      </Tag>
    ),
    default: true,
  },
  updateCount: {
    id: "updateCount",
    title: "Update Count",
    sortable: true,
    getValue: (query) => <Text>{query.state.dataUpdateCount}</Text>,
  },
  cacheTime: {
    id: "cacheTime",
    title: "Cache Time (ms)",
    sortable: true,
    getValue: (query) => <Text>{query.cacheTime}</Text>,
  },
  staleTime: {
    id: "staleTime",
    title: "Stale Time (ms)",
    sortable: true,
    getValue: (query) => <Text>{query.options.staleTime}</Text>,
  },
};

export function useColumns() {
  const columns = useMemo(() => {
    return Object.values(queryTableColumns).reduce((acc, columnDef) => {
      acc[columnDef.id] = {
        value: columnDef.title,
        sortable: !!columnDef.sortable,
      };
      return acc;
    }, {} as Record<string, { value: string; sortable: boolean }>);
  }, []);

  const columnOrder = useMemo(() => {
    return Object.values(queryTableColumns).reduce((acc, columnDef) => {
      acc.push({ key: columnDef.id, visible: true });
      return acc;
    }, [] as Array<{ key: string; visible: boolean }>);
  }, []);

  const columnSizes = useMemo(() => {
    return Object.values(queryTableColumns).reduce((acc, columnDef) => {
      columnDef.size && (acc[columnDef.id] = columnDef.size);
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const buildRow = useCallback((query: Query) => {
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
  }, []);

  return {
    columns,
    columnOrder,
    columnSizes,
    buildRow,
  };
}
