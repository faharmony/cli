# ☯️ harmony CLI

Node command line to install and manage Harmony framework.

## Usage

Enter the following command in the root of a Harmony app (with proper NPM auth token) to install or update Harmony framework. It manages all required dependencies for various harmony packages.

```
npx faharmony/cli

-- or --

npx faharmony/cli <param>
```

The base command (without any params) will install the latest `core` package of harmony.

If there are any packages previously installed, it will update them. The update will try to match version tags (latest, SNAPSHOT, RC, etc.) of previous installation.

To install other packages than `core`, or to install a different version/tag, use Params.

### Params

The command can take one optional param which can be used to configure usage of harmony CLI. There are different types of possible params:

> All params are case-insensitive.

| param            | description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `--version | -v` | Check installed version of harmony.                         |
|                  | Eg. `npx faharmony/cli --version`                           |
|                  |                                                             |
| `--install | -i` | Install harmony's packages.                                 |
|                  | Second param: core, table, charts, form                     |
|                  | Eg. `npx faharmony/cli --install table`                     |
|                  |                                                             |
| `--module | -m`  | Generate harmony module using plop.                         |
|                  | Second param: ModuleID (string with all-lowercase letters)  |
|                  | Eg. `npx faharmony/cli --module sample`                     |
|                  |                                                             |
| `--tag | -t`     | Install specific tagged version of harmony.                 |
|                  | Second param: stable, latest, snapshot, dev, rc, freeze     |
|                  | Eg. `npx faharmony/cli --tag snapshot`                      |
|                  |                                                             |
| `--sync | -s`    | Synchronize current branch with FA_REACT_APP repo template. |
|                  | Eg. `npx faharmony/cli --sync`                              |
