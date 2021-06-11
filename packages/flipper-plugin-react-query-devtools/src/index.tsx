import { parse } from "flatted";
import {
  createState, Layout, PluginClient,
  usePlugin, useValue
} from "flipper-plugin";
import React from "react";
import QueryTable from "./components/QueryTable";

type Query = any;
type Queries = Query[];

type Events = {
  queries: { queries: string };
};

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, {}>) {
  const data = createState<Queries>([], { persist: "queries" });

  client.onMessage("queries", (queries) => {
    data.set(parse(queries.queries));
  });

  return { data };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);
  const data = useValue(instance.data);

  return (
    <Layout.ScrollContainer>
      <QueryTable queries={data} />
    </Layout.ScrollContainer>
  );
}
