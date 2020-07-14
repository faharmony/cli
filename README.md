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

| param           | description                                                 |
| --------------- | ----------------------------------------------------------- |
| `--tag, -t`     | Install specific tagged version of harmony.                 |
|                 | param value: stable, latest, snapshot, dev, rc, freeze      |
|                 | `npx faharmony/cli --tag snapshot`                          |
|                 |                                                             |
| `--install, -i` | Install harmony's packages.                                 |
|                 | param value: table, charts, form                            |
|                 | `npx faharmony/cli --install table`                         |
|                 |                                                             |
| `--module, -m`  | Generate harmony module using plop.                         |
|                 | param value: a ModuleID (string with all-lowercase letters) |
|                 | `npx faharmony/cli --module sample`                         |
|                 |                                                             |
| `--sync, -s`    | Synchronize current branch with template repo.              |
|                 |                                                             |
| `--version, -v` | Check installed version of harmony.                         |
|                 |                                                             |
| `--help, -h`    | Displays this message.                                      |
