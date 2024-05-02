## Requirements

### Install nvm


```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Read more: https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating

### Install node version

```
nvm install v20.12.2
nvm use v20.12.2

node --version
# v20.12.2
```

### Install dependency

```
npm install
```

## Prepare file .env

```
cp .env.example .env
```

## Generate JWT SECRET KEY

Generate Secret Key
```
npm run key:generate
```

Update key `JWT_SECRET` within file `.env`

## Update JWT_SECRET
```
nm run key:update
```