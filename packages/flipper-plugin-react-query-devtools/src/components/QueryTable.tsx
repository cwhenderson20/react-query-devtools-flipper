import React from "react";
import { SearchableTable, Text } from "flipper";
import type { Query } from "react-query";

type Props = {
  queries: Query[];
};

export default function QueryTable({ queries }: Props) {
  return (
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
    />
  );
}
