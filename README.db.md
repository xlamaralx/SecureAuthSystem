# Migração de Banco de Dados

Este guia explica como trabalhar com migrações de banco de dados e transferência de dados entre ambientes no projeto.

## Ferramentas Disponíveis

O projeto utiliza o Drizzle ORM para gerenciamento de banco de dados e oferece vários scripts para facilitar as migrações:

1. **migrate-db.sh** - Script interativo para gerenciar migrações de esquema
2. **migrate-data.js** - Script para exportar/importar dados entre ambientes
3. **drizzle.config.migration.ts** - Configuração para geração de migrações

## Migrações de Esquema

As migrações de esquema gerenciam a estrutura do banco de dados (tabelas, colunas, índices, etc.).

### Usando o script `migrate-db.sh`

Este script interativo oferece várias opções:

```bash
# Tornar o script executável
chmod +x migrate-db.sh

# Executar o script
./migrate-db.sh
```

Opções disponíveis:

1. **Gerar migração** - Cria um arquivo SQL com as alterações necessárias para atualizar o esquema
2. **Aplicar migração** - Executa `db:push` para aplicar as alterações (com opção de backup)
3. **Validar esquema atual** - Verifica se o esquema do banco de dados está em sincronia com os modelos
4. **Backup do banco de dados atual** - Cria um arquivo SQL com o estado atual do banco
5. **Restaurar banco de dados de um backup** - Restaura um banco de dados a partir de um backup

### Manualmente

Você também pode executar manualmente os comandos:

```bash
# Gerar migrações
npx drizzle-kit generate:pg --config=./drizzle.config.migration.ts

# Aplicar migrações (via push)
npm run db:push

# Verificar estado do banco
npx drizzle-kit check:postgres
```

## Migração de Dados

Para transferir dados entre ambientes (desenvolvimento, homologação, produção), use o script `migrate-data.js`:

### Exportar dados

```bash
# Exportar todos os dados para um arquivo JSON
node migrate-data.js export
```

Isto criará um arquivo no formato `data-export-YYYY-MM-DD.json`.

### Importar dados

```bash
# Simular importação sem alterar o banco (dry run)
node migrate-data.js import data-export-YYYY-MM-DD.json --dry-run

# Importar dados realmente
node migrate-data.js import data-export-YYYY-MM-DD.json
```

## Melhores Práticas

1. **Sempre faça backup antes de migrar** - O script `migrate-db.sh` oferece esta opção automaticamente
2. **Teste em ambiente de desenvolvimento primeiro** - Nunca aplique migrações diretamente em produção
3. **Mantenha as migrações versionadas** - Commits no Git devem incluir os arquivos de migração
4. **Dados sensíveis** - O script de exportação remove senhas e outros dados sensíveis automaticamente
5. **Senhas na importação** - Senhas importadas são definidas como temporárias e devem ser alteradas

## Solução de Problemas

### Erro de conexão com o banco

Verifique se:
- A variável `DATABASE_URL` está corretamente configurada
- O servidor PostgreSQL está em execução
- As credenciais (usuário/senha) estão corretas
- O firewall permite a conexão

### Erro durante migração

Se ocorrer um erro durante a migração e houver um backup:

```bash
# Usando o script
./migrate-db.sh
# Selecione a opção 5 (Restaurar banco de dados de um backup)

# Ou manualmente
psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
```

### Conflitos de esquema

Se houver conflitos entre o esquema definido no código e o banco de dados:

1. Execute `npx drizzle-kit check:postgres` para identificar as diferenças
2. Atualize o modelo em `shared/schema.ts` ou use `npx drizzle-kit generate:pg` para gerar uma migração para resolver as diferenças