# Edge Native IDE

## Table of Contents

- [Setup for Development](#setup-for-development)
  - [Environment](#environment)
  - [Install](#clone-and-install-dependencies)
  - [Development](#development)
  - [Production Build](#testing-a-production-build)
- [Contributing](#contributing)
  - [Opening Issues](#opening-issues)
  - [Becoming a Contributor](#becoming-a-contributor)
- [Feedback](#feedback)

## Setup for Development

### Environment

#### OSX

It is recommended that you use node v5.x and npm 3.x for best results. This project also requires the Ruby 'Bundler' gem.

Installing these on your Mac is easy with [Homebrew](brew.sh)
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Now that [Homebrew](brew.sh) is installed you can run these commands:

```
brew install node
brew install ruby
gem install bundler
```

#### Linux

Linux is not supported at this time.

#### Windows

Windows is not supported at this time.

### Clone and Install Dependencies
```
$ git clone git@github.com:decosoftware/deco-ide
$ cd ./deco-ide/web
$ npm install
$ bundle install
$ cd ../desktop
$ npm install
$ npm run copy-libs
$ cd ../shared
$ npm install
```

### Development

Deco core is split into three sub-projects...

1. [Web](web/README.md)
  - A webpack bundle that assumes it's been loaded by Electron's BrowserWindow.
2. [Desktop](desktop/README.md)
  - A webpack bundle that runs in Electron's NodeJS environment and controls the desktop APIs.
3. [Shared](shared/README.md)
  - Shared constants for communicating over our IPC (inter-process communication) abstraction layer.

#### Quick Start
```
$ cd ./deco-ide
$ ./run-dev.js
```

#### Manual Start
Occasionally it is helpful to stop and restart the `desktop` gulp task without stopping the `web` gulp task. To do this you can run the following commands...

```
$ cd ./web
$ npm run watch

```
This command will:
1. Watch the `./web/src` directory and re-build on any changes to the code
2. Serve the build on localhost:8080

```
# Open a new terminal window
$ cd ./desktop
$ npm run start
```

This command will:
1. Build `./desktop/src` and place the result into `./desktop/build/app.js`
2. Launch a local Electron binary and load in the bundle from `desktop/build/app.js`

### Testing a Production Build

```
$ cd ./desktop
$ npm run pack
```

### Linting and testing

* Run `npm test` in root directory to see the lint errors.
* Running `npm run lint:fix` in `/web` or `/desktop` will fix trivial fixable eslint errors.

The resulting .pkg file will be output to `./dist/osx/Deco-$VERSION.pkg`

This build is for local testing only. When you install, the system will generate a warning about this being from an unapproved developer — this is because the package is not signed when building locally.
