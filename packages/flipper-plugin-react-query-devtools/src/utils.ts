import type { Query } from "react-query";

export function getQueryStatusLabel(query: Query) {
  return query.state.isFetching
    ? "fetching"
    : !getObserversCount(query)
    ? "inactive"
    : getIsStale(query)
    ? "stale"
    : "fresh";
}

const theme = {
  gray: "#3f4e60",
  success: "#00ab52",
  active: "#006bff",
  warning: "#ffb200",
};

export function getQueryStatusColor(query: Query) {
  return query.state.isFetching
    ? theme.active
    : getIsStale(query)
    ? theme.warning
    : !getObserversCount(query)
    ? theme.gray
    : theme.success;
}

function getIsStale(query: Query) {
  return (
    query.state.isInvalidated ||
    !query.state.dataUpdatedAt ||
    query.observers?.some((observer) => observer.currentResult.isStale)
  );
}

function getObserversCount(query: Query) {
  return query.observers?.length ?? 0;
}
