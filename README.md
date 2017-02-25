# env-var-fp

Functional utility for parsing env variables

## Usage

```typescript
import { env, requires } from 'env-var-fp';
import { defaultTo } from 'lodash/fp';

// Throws exception
env(requires)('UNDEFINED_VAR')

// Returns 2
env(defaultTo('2'), parseFloat)('UNDEFINED_VAR')
```

## License

MIT
