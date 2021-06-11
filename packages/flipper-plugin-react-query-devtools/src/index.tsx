import { parse } from "flatted";
import {
  createState,
  Layout,
  PluginClient,
  usePlugin,
  useValue,
} from "flipper-plugin";
import React, { useMemo, useState } from "react";
import type { Query } from "react-query";
import QueryTable from "./components/QueryTable";
import Sidebar from "./components/Sidebar";

type Events = {
  queries: { queries: string };
};

export function plugin(client: PluginClient<Events, {}>) {
  const queries = createState<Query[]>([], { persist: "queries" });
  const selectedQueryHash = createState<string | null>(null, {
    persist: "selectedQueryHash",
  });

  client.onMessage("queries", (data) => {
    queries.set(parse(data.queries));
  });

  function setSelectedQueryHash(queryHash: string) {
    console.log('setting selectedQueryHash', queryHash);
    selectedQueryHash.set(queryHash);
  }

  return {
    queries,
    selectedQueryHash,
    setSelectedQueryHash,
  };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);
  const queries = useValue(instance.queries);
  const selectedQueryHash = useValue(instance.selectedQueryHash);
  const selectedQuery = useMemo(
    () => queries.find((query) => {
      console.log('query has', query.queryHash);
      return query.queryHash === selectedQueryHash
    }),
    [selectedQueryHash, queries]
  );

  return (
    <Layout.Horizontal grow gap pad>
      <QueryTable
        queries={queries}
        onSelectRow={instance.setSelectedQueryHash}
      />
      {selectedQuery && <Sidebar query={selectedQuery} />}
    </Layout.Horizontal>
  );
}
