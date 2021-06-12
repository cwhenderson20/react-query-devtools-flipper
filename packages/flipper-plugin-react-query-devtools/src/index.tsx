import { parse } from "flatted";
import {
  createState,
  Layout,
  PluginClient,
  usePlugin,
  useValue,
} from "flipper-plugin";
import React, { useMemo, useState } from "react";
import type { Query, QueryKey } from "react-query";
import QueryTable from "./components/QueryTable";
import Sidebar from "./components/Sidebar";

type Events = {
  queries: { queries: string };
};

type Methods = {
  refetchQuery(queryKey: QueryKey): Promise<void>;
  invalidateQuery(queryKey: QueryKey): Promise<void>;
  resetQuery(queryKey: QueryKey): Promise<void>;
  removeQuery(queryKey: QueryKey): Promise<void>;
};

export function plugin(client: PluginClient<Events, Methods>) {
  const queries = createState<Query[]>([], { persist: "queries" });
  const selectedQueryHash = createState<string | null>(null, {
    persist: "selectedQueryHash",
  });

  client.onMessage("queries", (data) => {
    queries.set(parse(data.queries));
  });

  function setSelectedQueryHash(queryHash: string | null) {
    selectedQueryHash.set(queryHash);
  }

  async function refetchQuery(queryKey: QueryKey) {
    try {
      await client.send("refetchQuery", queryKey);
    } catch (error) {
      console.error("Refetch query failed", error);
    }
  }

  async function invalidateQuery(queryKey: QueryKey) {
    try {
      await client.send("invalidateQuery", queryKey);
    } catch (error) {
      console.error("Invalidate query failed", error);
    }
  }

  async function resetQuery(queryKey: QueryKey) {
    try {
      await client.send("resetQuery", queryKey);
    } catch (error) {
      console.error("Reset query failed", error);
    }
  }

  async function removeQuery(queryKey: QueryKey) {
    try {
      await client.send("removeQuery", queryKey)
    } catch (error) {
      console.error("Remove query failed", error)
    }
  }

  return {
    queries,
    selectedQueryHash,
    setSelectedQueryHash,
    refetchQuery,
    invalidateQuery,
    resetQuery,
    removeQuery,
  };
}

export function Component() {
  const instance = usePlugin(plugin);
  const queries = useValue(instance.queries);
  const selectedQueryHash = useValue(instance.selectedQueryHash);
  const selectedQuery = useMemo(
    () =>
      queries.find((query) => {
        return query.queryHash === selectedQueryHash;
      }),
    [selectedQueryHash, queries]
  );

  return (
    <Layout.Horizontal grow gap pad>
      <QueryTable
        queries={queries}
        onSelectRow={instance.setSelectedQueryHash}
      />
      {selectedQuery && (
        <Sidebar
          query={selectedQuery}
          onRefetchQuery={instance.refetchQuery}
          onInvalidateQuery={instance.invalidateQuery}
          onResetQuery={instance.resetQuery}
          onRemoveQuery={instance.removeQuery}
        />
      )}
    </Layout.Horizontal>
  );
}
