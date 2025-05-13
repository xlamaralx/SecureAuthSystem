// Script para migração de dados entre ambientes
// Este script pode ser usado para transferir dados entre diferentes bancos de dados

import { pool, db } from './server/db.js';
import { users } from './shared/schema.js';
import fs from 'node:fs';
import { eq } from 'drizzle-orm';

async function exportData() {
  console.log('Exportando dados do banco...');
  
  try {
    // Exportar usuários
    const allUsers = await db.select().from(users);
    console.log(`Exportando ${allUsers.length} usuários...`);
    
    // Remover senhas para segurança
    const safeUsers = allUsers.map(user => {
      const { password, ...safeUser } = user;
      return {
        ...safeUser,
        // Adicionar senha mascarada para identificação
        password: 'ENCRYPTED_PASSWORD'
      };
    });
    
    // Criar objeto com todos os dados
    const exportData = {
      users: safeUsers,
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    
    // Escrever em arquivo JSON
    const filename = `data-export-${new Date().toISOString().slice(0, 10)}.json`;
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    
    console.log(`Dados exportados com sucesso para ${filename}`);
    return filename;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    throw error;
  }
}

async function importData(filename, options = { dryRun: true }) {
  console.log(`Importando dados de ${filename}...`);
  console.log(`Modo: ${options.dryRun ? 'Simulação (dry run)' : 'Importação real'}`);
  
  try {
    if (!fs.existsSync(filename)) {
      throw new Error(`Arquivo ${filename} não encontrado`);
    }
    
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    
    // Validar estrutura do arquivo
    if (!data.users || !Array.isArray(data.users)) {
      throw new Error('Formato de arquivo inválido');
    }
    
    console.log(`Encontrados ${data.users.length} usuários para importar`);
    
    if (options.dryRun) {
      console.log('Modo de simulação ativado. Nenhuma alteração será feita no banco de dados.');
      console.log('Resumo da importação:');
      console.log(`- ${data.users.length} usuários seriam importados`);
      return;
    }
    
    // Importação real
    // Aqui você pode implementar a lógica para importar os dados
    // Por exemplo, inserir novos usuários que não existem, atualizar existentes, etc.
    
    for (const user of data.users) {
      // Verificar se o usuário já existe
      const existingUser = await db.select().from(users).where(eq(users.email, user.email));
      
      if (existingUser.length > 0) {
        console.log(`Usuário ${user.email} já existe. Atualizando...`);
        // Remover campos que não queremos atualizar
        const { id, password, created_at, ...updateData } = user;
        
        await db.update(users)
          .set(updateData)
          .where(eq(users.email, user.email));
      } else {
        console.log(`Criando novo usuário: ${user.email}`);
        // Para novos usuários, precisaria definir uma senha
        // Neste exemplo, definimos uma senha padrão que deve ser alterada
        const { id, ...userData } = user;
        
        if (userData.password === 'ENCRYPTED_PASSWORD') {
          userData.password = 'temporaryPassword123'; // Senha temporária
        }
        
        await db.insert(users).values(userData);
      }
    }
    
    console.log('Importação concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    throw error;
  }
}

// Função principal para ser executada via linha de comando
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'export':
        await exportData();
        break;
        
      case 'import':
        const filename = args[1];
        if (!filename) {
          console.error('Nome do arquivo de importação não fornecido');
          console.log('Uso: node migrate-data.js import <filename> [--dry-run]');
          process.exit(1);
        }
        
        const dryRun = args.includes('--dry-run');
        await importData(filename, { dryRun });
        break;
        
      default:
        console.log('Uso: node migrate-data.js <comando>');
        console.log('Comandos disponíveis:');
        console.log('  export                     Exporta dados do banco atual');
        console.log('  import <filename>          Importa dados do arquivo especificado');
        console.log('  import <filename> --dry-run  Simula a importação sem alterar o banco');
    }
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    // Fechar conexão com o banco
    await pool.end();
  }
}

// Executar o script
main();