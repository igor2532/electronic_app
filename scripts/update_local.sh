#!/bin/bash
echo "🔁 Жёсткое обновление из GitHub..."
git reset --hard
git clean -fd
git fetch origin
git reset --hard origin/main
echo "✅ Локальный репозиторий обновлён."
