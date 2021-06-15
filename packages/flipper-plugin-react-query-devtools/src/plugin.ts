import { parse } from "flatted";
import { TableRowSortOrder } from "flipper";
import { createState, PluginClient } from "flipper-plugin";
import type { Query, QueryKey } from "react-query";

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
  const sortOrder = createState<TableRowSortOrder | undefined>(undefined, {
    persist: "sortOrder",
  });

  client.onMessage("queries", (data) => {
    queries.set(parse(data.queries));
  });

  function setSelectedQueryHash(queryHash: string | null) {
    selectedQueryHash.set(queryHash);
  }

  function setSortOrder(order: TableRowSortOrder) {
    sortOrder.set(order);
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
      await client.send("removeQuery", queryKey);
    } catch (error) {
      console.error("Remove query failed", error);
    }
  }

  return {
    queries,
    selectedQueryHash,
    sortOrder,
    setSortOrder,
    setSelectedQueryHash,
    refetchQuery,
    invalidateQuery,
    resetQuery,
    removeQuery,
  };
}
