# react-query-devtools-flipper

React Native client plugin for [flipper-plugin-react-query-devtools](https://github.com/cwhenderson20/react-query-devtools-flipper/tree/master/packages/flipper-plugin-react-query-devtools)

## Installation

```sh
npm install react-query-devtools-flipper react-native-flipper
# or
yarn add react-query-devtools-flipper react-native-flipper
```

## Usage

```tsx
import { useFlipperDevtools } from 'react-query-devtools-flipper';
import { QueryClient } from 'react-query';

const queryClient = new QueryClient();

function Component() {
  useFlipperDevtools(queryClient);

  return <View>{/*...*/}</View>;
}
```

The hook automatically handles only enabling the plugin in development environments.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
