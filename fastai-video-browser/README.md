## fast.ai Video Browser

The interesting stuff is in src/components. data.js is what you need to edit.

tools/build-site.sh is used to rebuild the production JS.

## Contributing
### Dependency Management
The viewer uses [Yarn](https://classic.yarnpkg.com/en/docs/install) for dependency management, to install the project dependencies:

```sh
$ cd <directory where package.json is located>
$ yarn
```
### Workflow
The viewer is built using [create-react-app](https://create-react-app.dev), the available commands and features are outlined [here](https://create-react-app.dev/docs/getting-started#scripts).

To run the dev server:
```sh
$ yarn start
```

To build the app to the `/build` directory:
```sh
$ yarn build
```

### Styling
For styling, the viewer uses [Tailwind CSS](https://tailwindcss.com/) library with the [twin.macro](https://github.com/ben-rogerson/twin.macro) jsx macro.

If you plan on creating new jsx files that use the _tw_ prop, you need to replace the React import with a jsx pragma:

replace

```javascript
import React from 'react';
```

with

```javascript
/** @jsx jsx */ // <= Don't forget this line
import { jsx } from '@emotion/core';
import 'twin.macro';
```

for all files using the _tw=""_ prop.
