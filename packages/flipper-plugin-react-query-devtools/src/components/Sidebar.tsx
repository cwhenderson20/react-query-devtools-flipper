import React from "react";
import type { Query, QueryKey } from "react-query";
import { Panel, DetailSidebar, ManagedDataInspector, Toolbar } from "flipper";
import { Button } from "antd";

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
      <Panel floating={false} heading="Query Details">
        <ManagedDataInspector
          data={{ "Query Key": query.queryKey }}
          expandRoot={true}
        />
      </Panel>
      <Panel floating={false} heading="Actions">
        <Toolbar>
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
        </Toolbar>
      </Panel>
      <Panel floating={false} heading="Data Explorer">
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
