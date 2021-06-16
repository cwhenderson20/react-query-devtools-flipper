import * as React from 'react';
import { stringify } from 'flatted';
import type { QueryClient } from 'react-query';

let FlipperModule: typeof import('react-native-flipper') | undefined;

try {
  FlipperModule = require('react-native-flipper');
} catch (error) {
  // do nothing
}

export default function useFlipperDevtools(queryClient: QueryClient) {
  if (FlipperModule == null) {
    throw new Error(
      `Please install the 'react-native-flipper' package in your project to use Flipper integration for React Query`
    );
  }

  const { addPlugin } = FlipperModule;

  const queryCache = queryClient.getQueryCache();
  const unsubscribeRef =
    React.useRef<ReturnType<typeof queryCache['subscribe']>>();

  function unsubscribe() {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = undefined;
    }
  }

  React.useEffect(() => {
    addPlugin({
      getId() {
        return 'react-query-devtools-flipper';
      },
      onConnect(connection) {
        function sendQueries() {
          connection.send('queries', {
            queries: stringify(Object.values(queryCache.findAll())),
          });
        }

        // hydrate the initial state
        sendQueries();

        unsubscribeRef.current = queryCache.subscribe(() => {
          sendQueries();
        });

        connection.receive('refetchQuery', (queryKey, responder) => {
          const query = queryCache.find(queryKey);

          if (query) {
            query.fetch().then(
              () => responder.success(),
              (error) => responder.error(error)
            );
          }
        });

        connection.receive('invalidateQuery', (queryKey, responder) => {
          queryClient.invalidateQueries(queryKey).then(
            () => responder.success(),
            (error) => responder.error(error)
          );
        });

        connection.receive('resetQuery', (queryKey, responder) => {
          queryClient.resetQueries(queryKey).then(
            () => responder.success(),
            (error) => responder.error(error)
          );
        });

        connection.receive('removeQuery', (queryKey, responder) => {
          queryClient.removeQueries(queryKey);
          responder.success();
        });
      },
      onDisconnect() {
        unsubscribe();
      },
      runInBackground: () => true,
    });

    return () => {
      unsubscribe();
    };
  }, [addPlugin, queryCache, queryClient]);
}
