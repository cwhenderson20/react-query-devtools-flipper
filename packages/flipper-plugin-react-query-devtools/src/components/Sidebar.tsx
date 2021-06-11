import React from "react";
import { Query } from "react-query";
import { Layout, Panel, DetailSidebar, ManagedDataInspector } from "flipper";

type Props = {
  query: Query;
};

export default function Sidebar({ query }: Props) {
  return (
    <DetailSidebar>
      <Panel floating={false} heading="Query Details">
        <ManagedDataInspector
          data={{ "Query Key": query.queryKey }}
          expandRoot={true}
        />
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
