#!/bin/bash

# Script para build e deploy da aplicação em servidor próprio

echo "Iniciando processo de build..."

# Etapa 1: Instalar dependências
echo "Instalando dependências..."
npm install

# Etapa 2: Compilar o frontend
echo "Compilando frontend..."
NODE_ENV=production npx vite build

# Etapa 3: Compilar o backend
echo "Compilando backend..."
NODE_ENV=production npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Etapa 4: Copiar arquivos necessários para a pasta dist
echo "Copiando arquivos de configuração..."
cp .env dist/ 2>/dev/null || echo "Arquivo .env não encontrado, usando variáveis de ambiente do sistema"

echo "Build concluído com sucesso!"
echo "Para iniciar a aplicação em produção, execute: NODE_ENV=production node dist/index.js"