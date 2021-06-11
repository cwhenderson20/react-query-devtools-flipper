import React from "react";
import { Layout, SearchableTable, Text } from "flipper";
import type { Query } from "react-query";

type Props = {
  queries: Query[];
  onSelectRow: (queryHash: string) => void;
};

export default function QueryTable({ queries, onSelectRow }: Props) {
  function onRowHighlighted(rowArray: string[]) {
    onSelectRow(rowArray.length === 1 ? rowArray[0] : null);
  }

  return (
    <Layout.Container grow>
      <SearchableTable
        autoHeight={true}
        columns={{
          updatedAt: { value: "Updated Time" },
          status: { value: "Status" },
          queryHash: { value: "Query Hash" },
        }}
        floating={false}
        grow={true}
        multiline={false}
        rows={queries.map((query) => ({
          columns: {
            updatedAt: {
              value: (
                <Text>{new Date(query.state.dataUpdatedAt).toString()}</Text>
              ),
            },
            status: {
              value: <Text>{query.state.status}</Text>,
            },
            queryHash: {
              value: <Text>{query.queryHash}</Text>,
            },
          },
          key: query.queryHash,
        }))}
        multiHighlight={false}
        onRowHighlighted={onRowHighlighted}
      />
    </Layout.Container>
  );
}
