#!/bin/bash
echo "📤 Заливка изменений на GitHub (с force)..."
git add .
git commit -m "🆕 Обновления"
git push origin main --force
echo "✅ Изменения принудительно загружены на GitHub."
