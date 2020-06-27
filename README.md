# :yin_yang: harmony CLI

Node command line to install and manage Harmony framework.

## Usage

Enter the following command in the root of a Harmony app (with proper NPM auth token) to install or update Harmony framework. It manages all required dependencies for various harmony packages.

```
npx faharmony/cli

-- or --

npx faharmony/cli [param]
```

The base command (without any params) will install the latest `core` package of harmony.

If there are any packages previously installed, it will update them. The update will try to match version tags (latest, SNAPSHOT, RC, etc.) of previous installation.

To install other packages than `core`, or to install a different version/tag, use Params.

### Params

The command can take one optional param which can be used to configure usage of harmony CLI. There are different types of possible params:

> All params are case-insensitive.

#### Tag param

A tag param allows user to decide which tagged version of harmony to install.

| param      | description                                              |
| ---------- | -------------------------------------------------------- |
| `stable`   | Install latest STABLE (released) version of harmony      |
| `rc`       | Install latest RC (freeze) version of harmony            |
| `snapshot` | Install latest SNAPSHOT (development) version of harmony |

#### Package param

A package param allows user to install other main packages of harmony. Since these packages depend on `core` package, do run the command without package params before installing these packages.

| param    | description                      |
| -------- | -------------------------------- |
| `table`  | Install harmony's table package  |
| `charts` | Install harmony's charts package |
| `form`   | Install harmony's form package   |

#### Info param

An info param allows user retrieve some information about current setup.

| param     | description                                              |
| --------- | -------------------------------------------------------- |
| `version` | Check current version of harmony packages (if installed) |
