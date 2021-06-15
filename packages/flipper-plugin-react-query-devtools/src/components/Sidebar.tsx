import { Button, Input, Space, Tag, Typography } from "antd";
import { DetailSidebar, Layout, ManagedDataInspector, Panel } from "flipper";
import get from "lodash.get";
import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "../use-store";
import {
  getLastUpdatedAtString,
  getQueryStatusColor,
  getQueryStatusLabel,
} from "../utils";

export default function Sidebar() {
  const {
    selectedQuery: query,
    refetchQuery,
    invalidateQuery,
    resetQuery,
    removeQuery,
  } = useStore();
  const [filterKey, setFilterKey] = useState("");
  const filteredData = useMemo(
    () => get(query?.state.data, filterKey, query?.state.data),
    [query?.state.data, filterKey]
  );

  // reset the data filter when the selected query changes
  useEffect(() => {
    setFilterKey("");
  }, [query?.queryHash]);

  if (!query) {
    return null;
  }

  return (
    <DetailSidebar width={350}>
      <Panel
        floating={false}
        heading="Query Details"
        accessory={
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tag color={getQueryStatusColor(query)} style={{ marginRight: 0 }}>
              {getQueryStatusLabel(query)}
            </Tag>
          </div>
        }
      >
        <Layout.Container gap="tiny">
          <Layout.Horizontal gap style={{ justifyContent: "space-between" }}>
            <Typography.Text code>
              {JSON.stringify(query.queryKey, null, 2)}
            </Typography.Text>
          </Layout.Horizontal>
          <Layout.Horizontal style={{ justifyContent: "space-between" }}>
            <Typography.Text>Observers:</Typography.Text>
            <Typography.Text code>
              {
                // @ts-ignore: the `observers` property is available; can't use
                // getObserversCount because the query object has been
                // stringified and parsed
                query.observers?.length ?? 0
              }
            </Typography.Text>
          </Layout.Horizontal>
          <Layout.Horizontal style={{ justifyContent: "space-between" }}>
            <Typography.Text>Last Updated:</Typography.Text>
            <Typography.Text code>
              {getLastUpdatedAtString(query)}
            </Typography.Text>
          </Layout.Horizontal>
        </Layout.Container>
      </Panel>
      <Panel floating={false} heading="Actions">
        <Layout.Horizontal gap>
          <Button
            size="small"
            type="primary"
            disabled={query.state.isFetching}
            onClick={() => {
              refetchQuery(query.queryKey);
            }}
          >
            Refetch
          </Button>
          <Button
            size="small"
            onClick={() => {
              invalidateQuery(query.queryKey);
            }}
          >
            Invalidate
          </Button>
          <Button
            size="small"
            onClick={() => {
              resetQuery(query.queryKey);
            }}
          >
            Reset
          </Button>
          <Button
            size="small"
            danger={true}
            onClick={() => {
              removeQuery(query.queryKey);
            }}
          >
            Remove
          </Button>
        </Layout.Horizontal>
      </Panel>
      <Panel
        floating={false}
        heading="Data Explorer"
        collapsed={!query.state.data}
      >
        <Space size="small" direction="vertical">
          <Input
            placeholder="Filter key"
            value={filterKey}
            onChange={(e) => {
              e.stopPropagation();
              setFilterKey(e.target.value);
            }}
          />

          <ManagedDataInspector
            data={filteredData}
            expandRoot={typeof filteredData === "object"}
            collapsed={true}
          />
        </Space>
      </Panel>
      <Panel floating={false} heading="Query Explorer">
        <ManagedDataInspector data={query} expandRoot={true} collapsed={true} />
      </Panel>
    </DetailSidebar>
  );
}
