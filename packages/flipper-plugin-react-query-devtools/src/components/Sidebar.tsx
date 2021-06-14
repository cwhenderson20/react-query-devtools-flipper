import React from "react";
import type { Query, QueryKey } from "react-query";
import { Panel, DetailSidebar, ManagedDataInspector, Layout } from "flipper";
import { Button, Tag, Typography } from "antd";
import { getQueryStatusColor, getQueryStatusLabel } from "../utils";

type Props = {
  query: Query;
  onRefetchQuery: (queryKey: QueryKey) => void;
  onInvalidateQuery: (queryKey: QueryKey) => void;
  onResetQuery: (queryKey: QueryKey) => void;
  onRemoveQuery: (queryKey: QueryKey) => void;
};

export default function Sidebar({
  query,
  onRefetchQuery,
  onInvalidateQuery,
  onResetQuery,
  onRemoveQuery,
}: Props) {
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
              {new Date(query.state.dataUpdatedAt).toLocaleTimeString()}
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
              onRefetchQuery(query.queryKey);
            }}
          >
            Refetch
          </Button>
          <Button
            size="small"
            onClick={() => {
              onInvalidateQuery(query.queryKey);
            }}
          >
            Invalidate
          </Button>
          <Button
            size="small"
            onClick={() => {
              onResetQuery(query.queryKey);
            }}
          >
            Reset
          </Button>
          <Button
            size="small"
            danger={true}
            onClick={() => {
              onRemoveQuery(query.queryKey);
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
