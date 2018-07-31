# hot-export
Babel plugin to wrap default export with [react-hot-loader](https://github.com/gaearon/react-hot-loader)

```
...
export default thing;
```
will be transformed to
```
import { hot } from 'react-hot-loader';
...
export default hot(module)(thing);
```
