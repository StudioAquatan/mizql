## Mizql UI

### Environment
install `node_modules`
```bash
yarn install
```

cp env files
```bash
cp .env.sample .env.development
cp .env.sample .env.production
```

and, set params.

### Build
```bash
yarn build
```

### Run
#### Development mode
```bash
yarn start
```

#### Production mode
install http-server
```bash
npm install -g http-server
```

build & run
```bash
yarn build
cd build
hs
```