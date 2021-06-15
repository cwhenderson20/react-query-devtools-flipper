import { Layout } from "flipper-plugin";
import React from "react";
import QueryTable from "./components/QueryTable";
import Sidebar from "./components/Sidebar";

export function Component() {
  return (
    <Layout.Horizontal grow gap pad>
      <QueryTable />
      <Sidebar />
    </Layout.Horizontal>
  );
}

export * from "./plugin";
