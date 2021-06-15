import { Checkbox, Dropdown, Button, Menu, Tag, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Layout, SearchableTable, TableRowSortOrder, Text } from "flipper";
import React, { useMemo, useRef, useState } from "react";
import type { Query } from "react-query";
import {
  getLastUpdatedAtString,
  getObserversCount,
  getQueryStatusColor,
  getQueryStatusLabel,
  queryStatusColors,
  useColumns,
  useQueryStatuses,
  useSortedQueries,
} from "../utils";

type Props = {
  queries: Query[];
  onSelectRow: (queryHash: string | null) => void;
  sortOrder: TableRowSortOrder | undefined;
  setSortOrder: (order: TableRowSortOrder) => void;
};

const COLUMNS = {
  lastUpdated: {
    value: "Last Updated",
    sortable: true,
  },
  queryHash: {
    value: "Query Hash",
    sortable: true,
  },
  observerCount: {
    value: "Observer Count",
    sortable: true,
  },
  status: {
    value: "Status",
    sortable: true,
  },
  updateCount: {
    value: "Update Count",
    sortable: true,
  },
  cacheTime: {
    value: "Cache Time (ms)",
    sortable: true,
  },
  staleTime: {
    value: "Stale Time (ms)",
    sortable: true,
  },
};

const COLUMN_ORDER = [
  { key: "lastUpdated", visible: true },
  { key: "queryHash", visible: true },
  { key: "observerCount", visible: true },
  { key: "status", visible: true },
  { key: "updateCount", visible: true },
  { key: "cacheTime", visible: true },
  { key: "staleTime", visible: true },
];
const COLUMN_SIZES = { lastUpdated: 150 };

const menu = (
  <Menu
    onMouseDown={(e) => {
      e.stopPropagation();
    }}
  >
    <Menu.Item>
      <Checkbox>Last Updated</Checkbox>
    </Menu.Item>
    <Menu.Item>
      <Checkbox>Query Hash</Checkbox>
    </Menu.Item>
    <Menu.Item>
      <Checkbox>Observers</Checkbox>
    </Menu.Item>
    <Menu.Item>
      <Checkbox>Status</Checkbox>
    </Menu.Item>
    <Menu.Item>
      <Checkbox>Update Count</Checkbox>
    </Menu.Item>
    <Menu.Item>
      <Checkbox>Cache Time</Checkbox>
    </Menu.Item>
    <Menu.Item>
      <Checkbox>Stale Time</Checkbox>
    </Menu.Item>
  </Menu>
);

export default function QueryTable({
  queries,
  sortOrder,
  onSelectRow,
  setSortOrder,
}: Props) {
  function onRowHighlighted(rowArray: string[]) {
    onSelectRow(rowArray.length === 1 ? rowArray[0] : null);
  }

  const sortedQueries = useSortedQueries(queries, sortOrder);
  const { hasFetching, hasFresh, hasInactive, hasStale } =
    useQueryStatuses(queries);
  const { columns, columnOrder, columnSizes, buildRow } = useColumns();

  return (
    <Layout.Container grow gap>
      <SearchableTable
        actions={
          <Layout.Horizontal>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button size="small">
                Columns <DownOutlined />
              </Button>
            </Dropdown>
          </Layout.Horizontal>
        }
        columns={columns}
        onSort={setSortOrder}
        columnOrder={columnOrder}
        columnSizes={columnSizes}
        allowRegexSearch={true}
        floating={false}
        multiline={false}
        horizontallyScrollable={true}
        rows={sortedQueries.map(buildRow)}
        multiHighlight={false}
        onRowHighlighted={onRowHighlighted}
        zebra={true}
      />
      <Divider style={{ margin: 0 }} />
      <Layout.Horizontal>
        <Tag color={queryStatusColors.fresh}>fresh ({hasFresh})</Tag>
        <Tag color={queryStatusColors.fetching}>fetching ({hasFetching})</Tag>
        <Tag color={queryStatusColors.stale}>stale ({hasStale})</Tag>
        <Tag color={queryStatusColors.inactive}>inactive ({hasInactive})</Tag>
      </Layout.Horizontal>
    </Layout.Container>
  );
}
