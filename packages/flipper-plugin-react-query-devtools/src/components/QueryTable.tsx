import { Tag } from "antd";
import { Layout, SearchableTable, TableRowSortOrder, Text } from "flipper";
import React, { useMemo, useRef, useState } from "react";
import type { Query } from "react-query";
import {
  getLastUpdatedAtString,
  getQueryStatusColor,
  getQueryStatusLabel,
  queryStatusColors,
} from "../utils";

type Props = {
  queries: Query[];
  onSelectRow: (queryHash: string | null) => void;
};

const COLUMNS = {
  updatedAt: {
    value: "Last Updated",
    sortable: true,
  },
  queryHash: {
    value: "Query Hash",
    sortable: true,
  },
  status: {
    value: "Status",
    sortable: true,
  },
};

const COLUMN_ORDER = [
  { key: "updatedAt", visible: true },
  { key: "queryHash", visible: true },
  { key: "status", visible: true },
];
const COLUMN_SIZES = { updatedAt: 150 };
export default function QueryTable({ queries, onSelectRow }: Props) {
  const [sortOrder, setSortOrder] = useState<TableRowSortOrder>();

  function onRowHighlighted(rowArray: string[]) {
    onSelectRow(rowArray.length === 1 ? rowArray[0] : null);
  }

  const sortedQueries = useMemo(() => {
    if (!sortOrder) {
      return queries;
    }

    const sorted = [...queries];

    if (sortOrder.key === "updatedAt") {
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

  return (
    <Layout.Container grow>
      <SearchableTable
        actions={
          <Layout.Horizontal>
            <Tag color={queryStatusColors.fresh}>fresh ({hasFresh})</Tag>
            <Tag color={queryStatusColors.fetching}>
              fetching ({hasFetching})
            </Tag>
            <Tag color={queryStatusColors.stale}>stale ({hasStale})</Tag>
            <Tag color={queryStatusColors.inactive}>
              inactive ({hasInactive})
            </Tag>
          </Layout.Horizontal>
        }
        columns={COLUMNS}
        onSort={setSortOrder}
        columnOrder={COLUMN_ORDER}
        columnSizes={COLUMN_SIZES}
        allowRegexSearch={true}
        floating={false}
        grow={true}
        multiline={false}
        rows={sortedQueries.map((query) => ({
          key: query.queryHash,
          columns: {
            updatedAt: {
              value: <Text>{getLastUpdatedAtString(query)}</Text>,
            },
            queryHash: {
              value: <Text>{query.queryHash}</Text>,
            },
            status: {
              value: (
                <Tag
                  color={getQueryStatusColor(query)}
                  style={{ marginRight: 0 }}
                >
                  {getQueryStatusLabel(query)}
                </Tag>
              ),
              isFilterable: true,
            },
          },
        }))}
        multiHighlight={false}
        onRowHighlighted={onRowHighlighted}
        zebra={true}
      />
    </Layout.Container>
  );
}
