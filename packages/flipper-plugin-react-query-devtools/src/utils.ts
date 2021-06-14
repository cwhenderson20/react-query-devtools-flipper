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

export const queryStatusColors = {
  inactive: "#3f4e60",
  fresh: "#00ab52",
  fetching: "#006bff",
  stale: "#ffb200",
};

export function getQueryStatusColor(query: Query) {
  return query.state.isFetching
    ? queryStatusColors.fetching
    : getIsStale(query)
    ? queryStatusColors.stale
    : !getObserversCount(query)
    ? queryStatusColors.inactive
    : queryStatusColors.fresh
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

export function getLastUpdatedAtString(query: Query) {
  return query.state.dataUpdatedAt
    ? new Date(query.state.dataUpdatedAt).toLocaleTimeString()
    : "–";
}
