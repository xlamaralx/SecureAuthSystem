# Guia de Implantação em Servidor Próprio

Este guia fornece instruções passo a passo para implantar a aplicação em seu próprio servidor.

## Requisitos

- Node.js v20.x ou superior
- PostgreSQL 14.x ou superior
- Nginx ou Apache (para proxy reverso)
- Acesso SSH ao servidor
- Um domínio (opcional, mas recomendado)

## Configuração Inicial do Servidor

1. Atualize os pacotes do sistema:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. Instale o Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. Instale o PostgreSQL:
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   ```

4. Instale o Nginx:
   ```bash
   sudo apt install -y nginx
   ```

5. Configure o firewall:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

## Configuração do Banco de Dados

1. Acesse o PostgreSQL:
   ```bash
   sudo -u postgres psql
   ```

2. Crie um banco de dados e usuário:
   ```sql
   CREATE DATABASE sua_aplicacao;
   CREATE USER seu_usuario WITH ENCRYPTED PASSWORD 'sua_senha';
   GRANT ALL PRIVILEGES ON DATABASE sua_aplicacao TO seu_usuario;
   \q
   ```

## Deploy da Aplicação

1. Clone o repositório da aplicação:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git /var/www/sua-aplicacao
   cd /var/www/sua-aplicacao
   ```

2. Crie o arquivo `.env` de produção:
   ```bash
   cp .env.production.example .env
   nano .env
   ```

3. Edite o arquivo `.env` com as informações do seu ambiente:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgres://seu_usuario:sua_senha@localhost:5432/sua_aplicacao
   SESSION_SECRET=sua_string_aleatoria_muito_segura_aqui
   ```

4. Execute o script de deploy:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Configuração do Nginx

1. Crie uma configuração para o Nginx:
   ```bash
   sudo cp nginx.conf.example /etc/nginx/sites-available/sua-aplicacao
   sudo nano /etc/nginx/sites-available/sua-aplicacao
   ```

2. Edite o arquivo substituindo `seu-dominio.com` pelo seu domínio real e ajuste os caminhos conforme necessário.

3. Ative a configuração:
   ```bash
   sudo ln -s /etc/nginx/sites-available/sua-aplicacao /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Configuração do SSL com Let's Encrypt

1. Instale o Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtenha um certificado SSL:
   ```bash
   sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
   ```

3. Configure a renovação automática:
   ```bash
   sudo certbot renew --dry-run
   ```

## Manutenção

### Atualização da Aplicação

Para atualizar a aplicação com novas alterações:

```bash
cd /var/www/sua-aplicacao
git pull
./deploy.sh
```

### Reiniciar a Aplicação

Para reiniciar a aplicação em caso de problemas:

```bash
pm2 restart seu-app
```

### Verificar Logs

Para verificar os logs da aplicação:

```bash
pm2 logs seu-app
```

### Backup do Banco de Dados

Para fazer backup do banco de dados:

```bash
pg_dump -U seu_usuario -d sua_aplicacao -F c -f backup_$(date +%Y%m%d).dump
```

## Solução de Problemas

### A aplicação não inicia

1. Verifique os logs:
   ```bash
   pm2 logs seu-app
   ```

2. Verifique as variáveis de ambiente:
   ```bash
   cat .env
   ```

3. Verifique a conexão com o banco de dados:
   ```bash
   psql -U seu_usuario -d sua_aplicacao -h localhost
   ```

### Erro 502 Bad Gateway

1. Verifique se a aplicação está rodando:
   ```bash
   pm2 status
   ```

2. Verifique os logs do Nginx:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. Verifique se a porta da aplicação está sendo usada:
   ```bash
   sudo lsof -i :5000
   ```

## Suporte

Para obter suporte adicional, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório do projeto.