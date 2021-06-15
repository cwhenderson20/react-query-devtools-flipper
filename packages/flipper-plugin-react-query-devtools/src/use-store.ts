import { useLocalStorageState, usePlugin, useValue } from 'flipper-plugin';
import { useCallback, useMemo } from 'react';
import { plugin } from './plugin';
import { defaultVisibleColumns } from './utils';

export function useStore() {
  const instance = usePlugin(plugin);
  const queries = useValue(instance.queries);
  const sortOrder = useValue(instance.sortOrder);
  const selectedQueryHash = useValue(instance.selectedQueryHash);
  const selectedQuery = useMemo(
    () =>
      queries.find((query) => {
        return query.queryHash === selectedQueryHash;
      }),
    [selectedQueryHash, queries]
  );
  const [columnVisibility, setColumnVisibility] = useLocalStorageState<
    Record<string, boolean>
  >('columnVisibility', defaultVisibleColumns);

  const toggleColumnVisibility = useCallback(
    (id: string) => {
      setColumnVisibility({
        ...columnVisibility,
        [id]: !columnVisibility[id],
      });
    },
    [columnVisibility]
  );

  const {
    setSelectedQueryHash,
    setSortOrder,
    invalidateQuery,
    refetchQuery,
    resetQuery,
    removeQuery,
  } = instance;

  return {
    queries,
    sortOrder,
    selectedQueryHash,
    selectedQuery,
    columnVisibility,
    toggleColumnVisibility,
    setSelectedQueryHash,
    setSortOrder,
    invalidateQuery,
    refetchQuery,
    resetQuery,
    removeQuery,
  };
}
