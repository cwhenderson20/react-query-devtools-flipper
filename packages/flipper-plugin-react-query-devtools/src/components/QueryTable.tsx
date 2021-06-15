import { DownOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Dropdown, Menu, Tag } from "antd";
import { Layout, SearchableTable } from "flipper";
import React from "react";
import { useStore } from "../use-store";
import {
  queryStatusColors,
  queryTableColumns,
  useColumns,
  useQueryStatuses,
  useSortedQueries,
} from "../utils";

export default function QueryTable() {
  const {
    columnVisibility,
    setSortOrder,
    setSelectedQueryHash,
    toggleColumnVisibility,
  } = useStore();

  function onRowHighlighted(rowArray: string[]) {
    setSelectedQueryHash(rowArray.length === 1 ? rowArray[0] : null);
  }

  const sortedQueries = useSortedQueries();
  const { hasFetching, hasFresh, hasInactive, hasStale } = useQueryStatuses();
  const { columns, columnOrder, columnSizes, buildRow } =
    useColumns(columnVisibility);

  const menu = (
    <Menu
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      {Object.values(queryTableColumns).map((columnDef) => {
        return (
          <Menu.Item key={columnDef.id}>
            <Checkbox
              checked={columnVisibility[columnDef.id]}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleColumnVisibility(columnDef.id);
              }}
            >
              {columnDef.title}
            </Checkbox>
          </Menu.Item>
        );
      })}
    </Menu>
  );

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
