#!/bin/sh
set -e

echo "[start] Preparando diretórios no volume..."
mkdir -p /app/storage/data /app/storage/uploads/articles /app/storage/uploads/promotions

echo "[start] Aplicando migrations..."
npm run db:migrate

echo "[start] Rodando seed (idempotente)..."
npm run db:seed || echo "[start] Seed falhou ou já foi aplicado, seguindo..."

echo "[start] Subindo servidor..."
exec npm run start
