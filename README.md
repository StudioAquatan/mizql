# mizql

大雨洪水等の災害における逃げ遅れ防止アプリ

## Development

envファイルを用意する

```bash
$ cp frontend/.env.sample frontend/.env.production
$ cp env_files/app.env.sample env_files/app.env
$ cp env_files/db.env.sample env_files/db.env
$ cp env_files/static.env.sample env_files/static.env
```

DBコンテナを起動する

```bash
$ make rundb
```

イメージをビルドする．

```bash
# バックエンド
$ make image
# フロントエンド
$ make frontimage
```

#### Q. 毎回イメージのビルドしたくないんだけど?

根本的な解決方法はない．ワークアラウンドを紹介する．
`docker-compose.yml` を編集してコンテナに直接build結果のディレクトリをマウントする．

```yaml
version: "3"

services:
  # 省略
  nginx:
    image: studioaquatan/mizql-front:latest
    container_name: mizql-nginx-qa
    env_file:
      - env_files/static.env
    volumes:
      - ./env_files/conf_qa:/etc/nginx/conf.d
      - ./mizql/static:/usr/share/www/html/static
      # ビルド結果をマウント
      - ./frontend/build:/usr/share/www/html/front
    depends_on:
      - webapp
    ports:
      - 8800:80
```

## QA

```bash
# スタート
$ make qa-start
# ストップ
$ make qa-stop
# DBをデリート
$ make qa-clean
# マイグレーション
$ make qa-manage ARGS=migrate
# スーパユーザを作成
$ make qa-manage ARGS=createsuperuser
```

## Author

- pudding
- taxio
- ken_kentan

## License

MIT
