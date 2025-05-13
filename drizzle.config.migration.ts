import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// Verificar se a URL do banco de dados está definida
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não encontrado no ambiente');
}

export default defineConfig({
  schema: './shared/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  // Opções adicionais para migração
  verbose: true,
  strict: true,
});