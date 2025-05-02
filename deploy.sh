#!/bin/bash

# Script para deploy completo em servidor próprio

echo "Iniciando deploy da aplicação..."

# Verificar se o PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "PM2 não está instalado. Instalando..."
    npm install -g pm2
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "Arquivo .env não encontrado!"
    echo "Criando .env a partir do exemplo..."
    
    if [ -f .env.production.example ]; then
        cp .env.production.example .env
        echo "ATENÇÃO: Arquivo .env criado a partir do exemplo. Por favor, edite-o com suas configurações reais."
    else
        echo "ERRO: Arquivo .env.production.example não encontrado. Você precisa criar um arquivo .env manualmente."
        exit 1
    fi
fi

# Executar o script de build
echo "Executando build da aplicação..."
./build.sh

# Configurar PM2
echo "Configurando PM2 para gerenciar a aplicação..."
pm2 delete seu-app 2>/dev/null || echo "Aplicação não estava rodando no PM2"
pm2 start dist/index.js --name "seu-app" --env production

# Configurar PM2 para iniciar com o sistema
echo "Configurando PM2 para iniciar com o sistema..."
pm2 save
pm2 startup | tail -n 1

echo ""
echo "Deploy concluído com sucesso!"
echo "Sua aplicação está rodando sob o gerenciamento do PM2"
echo "Para verificar o status: pm2 status"
echo "Para ver os logs: pm2 logs seu-app"
echo ""
echo "IMPORTANTE: Configure seu proxy reverso (Nginx/Apache) para apontar para a porta configurada em .env"
echo "Exemplo de configuração do Nginx disponível em: nginx.conf.example"