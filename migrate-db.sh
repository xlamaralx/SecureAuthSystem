#!/bin/bash

# Script para migração de banco de dados usando Drizzle ORM
# Este script facilita a geração, aplicação e validação de migrações

# Cores para melhor visualização
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Script de Migração de Banco de Dados ===${NC}"
echo

# Verificar variáveis de ambiente
if [ -z "$DATABASE_URL" ]; then
  if [ -f .env ]; then
    echo -e "${YELLOW}Carregando variáveis de ambiente do arquivo .env${NC}"
    export $(grep -v '^#' .env | xargs)
  else
    echo -e "${RED}ERRO: Variável DATABASE_URL não encontrada e arquivo .env não existe.${NC}"
    echo "Por favor, configure a variável DATABASE_URL ou crie um arquivo .env"
    exit 1
  fi
fi

# Verificar conexão com o banco de dados
echo -e "${YELLOW}Verificando conexão com o banco de dados...${NC}"
if npx drizzle-kit check:postgres; then
  echo -e "${GREEN}Conexão com o banco de dados estabelecida com sucesso!${NC}"
else
  echo -e "${RED}ERRO: Não foi possível conectar ao banco de dados.${NC}"
  echo "Verifique se a variável DATABASE_URL está correta e se o banco de dados está acessível."
  exit 1
fi

# Menu de opções
echo
echo -e "${YELLOW}Selecione uma opção:${NC}"
echo "1. Gerar migração (drizzle-kit generate)"
echo "2. Aplicar migração (db:push)"
echo "3. Validar esquema atual (db:check)"
echo "4. Backup do banco de dados atual"
echo "5. Restaurar banco de dados de um backup"
echo "6. Sair"
echo

read -p "Opção: " option

case $option in
  1)
    echo -e "${YELLOW}Gerando migração...${NC}"
    npx drizzle-kit generate:pg
    echo -e "${GREEN}Migração gerada com sucesso!${NC}"
    ;;
  2)
    echo -e "${YELLOW}Aplicando migração...${NC}"
    
    # Perguntar se deve criar backup primeiro
    read -p "Deseja criar um backup antes de aplicar a migração? (s/n): " create_backup
    if [ "$create_backup" = "s" ] || [ "$create_backup" = "S" ]; then
      timestamp=$(date +%Y%m%d_%H%M%S)
      backup_file="backup_${timestamp}.sql"
      echo -e "${YELLOW}Criando backup do banco de dados...${NC}"
      pg_dump $DATABASE_URL > $backup_file
      echo -e "${GREEN}Backup criado em ${backup_file}${NC}"
    fi
    
    # Aplicar migração
    npm run db:push
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Migração aplicada com sucesso!${NC}"
    else
      echo -e "${RED}ERRO ao aplicar migração.${NC}"
      
      if [ "$create_backup" = "s" ] || [ "$create_backup" = "S" ]; then
        read -p "Deseja restaurar o backup? (s/n): " restore_backup
        if [ "$restore_backup" = "s" ] || [ "$restore_backup" = "S" ]; then
          echo -e "${YELLOW}Restaurando backup...${NC}"
          psql $DATABASE_URL < $backup_file
          echo -e "${GREEN}Backup restaurado com sucesso!${NC}"
        fi
      fi
    fi
    ;;
  3)
    echo -e "${YELLOW}Validando esquema atual...${NC}"
    npx drizzle-kit check:postgres
    echo -e "${GREEN}Validação concluída!${NC}"
    ;;
  4)
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backup_${timestamp}.sql"
    echo -e "${YELLOW}Criando backup do banco de dados...${NC}"
    pg_dump $DATABASE_URL > $backup_file
    echo -e "${GREEN}Backup criado em ${backup_file}${NC}"
    ;;
  5)
    echo -e "${YELLOW}Backups disponíveis:${NC}"
    ls -la backup_*.sql 2>/dev/null
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}Nenhum arquivo de backup encontrado.${NC}"
      exit 1
    fi
    
    read -p "Digite o nome do arquivo de backup para restaurar: " backup_file
    
    if [ ! -f "$backup_file" ]; then
      echo -e "${RED}Arquivo de backup não encontrado.${NC}"
      exit 1
    fi
    
    read -p "ATENÇÃO: Isso irá sobrescrever o banco de dados atual. Continuar? (s/n): " confirm
    if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
      echo -e "${YELLOW}Restaurando backup...${NC}"
      psql $DATABASE_URL < $backup_file
      echo -e "${GREEN}Backup restaurado com sucesso!${NC}"
    else
      echo "Operação cancelada."
    fi
    ;;
  6)
    echo "Saindo..."
    exit 0
    ;;
  *)
    echo -e "${RED}Opção inválida!${NC}"
    exit 1
    ;;
esac

echo
echo -e "${GREEN}Operação concluída!${NC}"