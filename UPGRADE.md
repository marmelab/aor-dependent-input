# Upgrade to 2.0

## aor-dependent-input renames to ra-dependent-input

To reflect [Admin On Rest name change to React Admin](https://github.com/marmelab/admin-on-rest/blob/next/UPGRADE.md#admin-on-rest-renamed-to-react-admin), 
we also changed this package's name.

You must update your dependencies:

```sh
npm uninstall aor-dependent-input
npm install ra-dependent-input
```

As well as all your files depending on the 'aor-dependent-input' package:

```js
// before
import { DependentInput } from 'aor-dependent-input'; 
// after
import { DependentInput } from 'ra-dependent-input'; 
```

## CSS Classes Changed

We follow [React Admin's new convention for CSS class name](https://github.com/marmelab/admin-on-rest/blob/next/UPGRADE.md#css-classes-changed).

* `aor-input-[source]` => `ra-input-source`
* `aor-input-[source]` => `ra-input-source`

