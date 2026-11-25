#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [[ $# -lt 1 || -z "${1// /}" ]]; then
  echo "Использование: $0 \"Название статьи\"" >&2
  exit 1
fi

title="$1"

slug=$(printf '%s' "${title,,}" \
  | sed \
    -e 's/а/a/g' -e 's/б/b/g' -e 's/в/v/g' -e 's/г/g/g' \
    -e 's/д/d/g' -e 's/е/e/g' -e 's/ё/yo/g' -e 's/ж/zh/g' \
    -e 's/з/z/g' -e 's/и/i/g' -e 's/й/j/g' -e 's/к/k/g' \
    -e 's/л/l/g' -e 's/м/m/g' -e 's/н/n/g' -e 's/о/o/g' \
    -e 's/п/p/g' -e 's/р/r/g' -e 's/с/s/g' -e 's/т/t/g' \
    -e 's/у/u/g' -e 's/ф/f/g' -e 's/х/h/g' -e 's/ц/c/g' \
    -e 's/ч/ch/g' -e 's/ш/sh/g' -e 's/щ/sch/g' \
    -e 's/ъ//g' -e 's/ы/y/g' -e 's/ь//g' -e 's/э/e/g' \
    -e 's/ю/yu/g' -e 's/я/ya/g' \
  | sed -e 's/[^a-z0-9]\+/-/g' -e 's/-\{2,\}/-/g' -e 's/^-//' -e 's/-$//')

if [[ -z "$slug" ]]; then
  echo "Ошибка: не удалось получить slug из названия" >&2
  exit 1
fi

dir="content/posts/$slug"
if [[ -e "$dir" ]]; then
  echo "Ошибка: $dir уже существует" >&2
  exit 1
fi

mkdir -p "$dir"

yaml_title=${title//\\/\\\\}
yaml_title=${yaml_title//\"/\\\"}

{
  printf -- '---\ntitle: "%s"\ndate: %s\nsummary: ""\ncategories: []\ntags: []\ndraft: false\n---\n' \
    "$yaml_title" "$(date +%FT%T%:z)"
  cat <<'EOF'

Краткий анонс статьи (виден в списке).

<!--more-->

Текст статьи.
EOF
} > "$dir/index.md"

echo "Создано: $dir/index.md"
echo "URL:     /posts/$slug/"

"${EDITOR:-vi}" "$dir/index.md"

read -r -p "Закоммитить и запушить в main? [y/N] " answer
if [[ "$answer" =~ ^[YyДд]$ ]]; then
  git add "$dir"
  git commit -m "post: $title"
  git push origin main
  echo "Готово — статья выйдет после деплоя."
else
  echo "Файл сохранён локально. Не забудь закоммитить."
fi
