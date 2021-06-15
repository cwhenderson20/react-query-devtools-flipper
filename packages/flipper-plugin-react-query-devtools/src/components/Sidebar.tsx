import { Button, Tag, Typography } from "antd";
import { DetailSidebar, Layout, ManagedDataInspector, Panel } from "flipper";
import React from "react";
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

  if (!query) {
    return null;
  }

  return (
    <DetailSidebar minWidth={300} width={350}>
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
        <ManagedDataInspector
          data={query.state?.data}
          expandRoot={true}
          collapsed={true}
        />
      </Panel>
      <Panel floating={false} heading="Query Explorer">
        <ManagedDataInspector data={query} expandRoot={true} collapsed={true} />
      </Panel>
    </DetailSidebar>
  );
}
