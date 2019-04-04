# Dipperin-Wallet

The Dipperin-Wallet is the offical wallet of the Dipperin blockchain.

## Installation

According to your platform, select the wallet of the corresponding platform on the [release page](https://github.com/caiqingfeng/dipperin-wallet/releases), install it or run it directly.

### Config folder

The data folder for Mist depends on your operating system:

- Windows `%APPDATA%\dipperin_wallet_${env}`
- macOS `~/Library/Application\ Support/dipperin_wallet_${env}`
- Linux `~/.config/dipperin_wallet_${env}`

## Development

### Dependencies

- Node.js v8.x
- Yarn  
- Docker (optional)

### Initialization

```shell
git clone https://github.com/caiqingfeng/dipperin-wallet.git
cd dipperin-wallet
yarn
```

### Develop Main Process

```shell
yarn watch:main
yarn electron
```

### Develop Renderer Process

```shell
yarn dev
```

### Deployment

Our build system relies on webpack and electron-builder.

You can simply run the following command to get an unpackaged wallet.

```shell
yarn build
```

Or you want an already packaged wallet that corresponds to the platform of your choice.

```shell
yarn release:${platform} // win, mac, linux, all
```

## Testing

Running unit test

```shell
yarn test
```

## Contributing

### [Contributing Guide](https://github.com/caiqingfeng/dipperin-wallet/blob/master/CONTRIBUTING.md)

Read our contributing guide to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to this project.
