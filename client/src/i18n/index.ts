import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a basic set of translation keys
export type TranslationKey = 
  | 'common.welcome'
  | 'common.login'
  | 'common.register'
  | 'common.logout'
  | 'common.email'
  | 'common.password'
  | 'common.optional'
  | 'common.name'
  | 'users.title'
  | 'users.subtitle'
  | 'users.addUser'
  | 'users.editUser'
  | 'users.deleteUser'
  | 'users.userRole'
  | 'users.adminRole'
  | 'users.noExpirationDate'
  | 'users.deleteConfirmation'
  | 'common.cancel'
  | 'common.save'
  | 'common.error'
  | 'common.role'
  | 'profile.title'
  | 'profile.subtitle'
  | 'profile.changePassword'
  | 'profile.currentPassword'
  | 'profile.newPassword'
  | 'profile.confirmNewPassword'
  | 'profile.updateSuccess'
  | 'profile.passwordUpdateSuccess'
  | 'profile.changePhoto'
  | 'profile.uploadPhoto'
  | 'common.profile'
  | 'settings.title'
  | 'settings.subtitle'
  | 'settings.themeSettings'
  | 'settings.interfaceSettings'
  | 'settings.languageSettings'
  | 'common.language'
  | 'common.theme'
  | 'common.layout'
  | 'common.darkMode'
  | 'common.lightMode'
  | 'settings.defaultTheme'
  | 'settings.blueTheme'
  | 'settings.greenTheme'
  | 'settings.purpleTheme'
  | 'settings.orangeTheme'
  | 'settings.customAccentColor'
  | 'settings.portuguese'
  | 'settings.english'
  | 'settings.updateSuccess'
  | 'common.unauthorized'
  | 'auth.pendingApproval'
  | 'common.authorized'
  | 'common.expiration'
  | 'common.createdAt'
  | 'common.actions'
  | 'users.userAdded'
  | 'users.userUpdated'
  | 'users.userDeleted'
  | 'users.userAuthorized'
  | 'users.userUnauthorized';

export type TranslationMap = Record<TranslationKey, string>;

// Just include a few translations for testing
const translations: Record<string, Partial<TranslationMap>> = {
  en: {
    'common.welcome': 'Welcome',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.logout': 'Logout',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.optional': 'optional',
    'common.name': 'Name',
    'common.role': 'Role',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.error': 'Error',
    'users.title': 'User Management',
    'users.subtitle': 'Manage system users',
    'users.addUser': 'Add User',
    'users.editUser': 'Edit User',
    'users.deleteUser': 'Delete User',
    'users.userRole': 'User',
    'users.adminRole': 'Admin',
    'users.noExpirationDate': 'No expiration date',
    'users.deleteConfirmation': 'Are you sure you want to delete this user?',
    'profile.title': 'Your Profile',
    'profile.subtitle': 'Manage your personal information',
    'profile.changePassword': 'Change Password',
    'profile.currentPassword': 'Current Password',
    'profile.newPassword': 'New Password',
    'profile.confirmNewPassword': 'Confirm New Password',
    'profile.updateSuccess': 'Profile updated successfully',
    'profile.passwordUpdateSuccess': 'Password updated successfully',
    'profile.changePhoto': 'Change Photo',
    'profile.uploadPhoto': 'Upload Photo',
    'common.profile': 'Profile',
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your experience',
    'settings.themeSettings': 'Theme Settings',
    'settings.interfaceSettings': 'Interface Settings',
    'settings.languageSettings': 'Language Settings',
    'common.language': 'Language',
    'common.theme': 'Theme',
    'common.layout': 'Layout',
    'common.darkMode': 'Dark Mode',
    'common.lightMode': 'Light Mode',
    'settings.defaultTheme': 'Default Theme',
    'settings.blueTheme': 'Blue Theme',
    'settings.greenTheme': 'Green Theme',
    'settings.purpleTheme': 'Purple Theme',
    'settings.orangeTheme': 'Orange Theme',
    'settings.customAccentColor': 'Custom Accent Color',
    'settings.portuguese': 'Portuguese',
    'settings.english': 'English',
    'settings.updateSuccess': 'Settings updated successfully',
    'common.unauthorized': 'Unauthorized',
    'auth.pendingApproval': 'Your account is pending approval',
    'common.authorized': 'Authorized',
    'common.expiration': 'Expiration',
    'common.createdAt': 'Created At',
    'common.actions': 'Actions',
    'users.userAdded': 'User added successfully',
    'users.userUpdated': 'User updated successfully',
    'users.userDeleted': 'User deleted successfully',
    'users.userAuthorized': 'User authorized successfully',
    'users.userUnauthorized': 'User unauthorized successfully'
  },
  pt: {
    'common.welcome': 'Bem-vindo',
    'common.login': 'Entrar',
    'common.register': 'Cadastrar',
    'common.logout': 'Sair',
    'common.email': 'Email',
    'common.password': 'Senha',
    'common.optional': 'opcional',
    'common.name': 'Nome',
    'common.role': 'Função',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.error': 'Erro',
    'users.title': 'Gerenciamento de Usuários',
    'users.subtitle': 'Gerencie os usuários do sistema',
    'users.addUser': 'Adicionar Usuário',
    'users.editUser': 'Editar Usuário',
    'users.deleteUser': 'Excluir Usuário',
    'users.userRole': 'Usuário',
    'users.adminRole': 'Administrador',
    'users.noExpirationDate': 'Sem data de expiração',
    'users.deleteConfirmation': 'Tem certeza que deseja excluir este usuário?',
    'profile.title': 'Seu Perfil',
    'profile.subtitle': 'Gerencie suas informações pessoais',
    'profile.changePassword': 'Alterar Senha',
    'profile.currentPassword': 'Senha Atual',
    'profile.newPassword': 'Nova Senha',
    'profile.confirmNewPassword': 'Confirmar Nova Senha',
    'profile.updateSuccess': 'Perfil atualizado com sucesso',
    'profile.passwordUpdateSuccess': 'Senha atualizada com sucesso',
    'profile.changePhoto': 'Alterar Foto',
    'profile.uploadPhoto': 'Enviar Foto',
    'common.profile': 'Perfil',
    'settings.title': 'Configurações',
    'settings.subtitle': 'Personalize sua experiência',
    'settings.themeSettings': 'Configurações de Tema',
    'settings.interfaceSettings': 'Configurações de Interface',
    'settings.languageSettings': 'Configurações de Idioma',
    'common.language': 'Idioma',
    'common.theme': 'Tema',
    'common.layout': 'Layout',
    'common.darkMode': 'Modo Escuro',
    'common.lightMode': 'Modo Claro',
    'settings.defaultTheme': 'Tema Padrão',
    'settings.blueTheme': 'Tema Azul',
    'settings.greenTheme': 'Tema Verde',
    'settings.purpleTheme': 'Tema Roxo',
    'settings.orangeTheme': 'Tema Laranja',
    'settings.customAccentColor': 'Cor de Destaque Personalizada',
    'settings.portuguese': 'Português',
    'settings.english': 'Inglês',
    'settings.updateSuccess': 'Configurações atualizadas com sucesso',
    'common.unauthorized': 'Não autorizado',
    'auth.pendingApproval': 'Sua conta está aguardando aprovação',
    'common.authorized': 'Autorizado',
    'common.expiration': 'Expiração',
    'common.createdAt': 'Criado em',
    'common.actions': 'Ações',
    'users.userAdded': 'Usuário adicionado com sucesso',
    'users.userUpdated': 'Usuário atualizado com sucesso',
    'users.userDeleted': 'Usuário excluído com sucesso',
    'users.userAuthorized': 'Usuário autorizado com sucesso',
    'users.userUnauthorized': 'Usuário desautorizado com sucesso'
  }
};

// Create a simple translator function
export function createTranslator() {
  // Default to Portuguese, but check browser language
  const browserLang = typeof navigator !== 'undefined' 
    ? navigator.language.split('-')[0] 
    : 'pt';
  
  const initialLang = browserLang === 'en' ? 'en' : 'pt';
  
  // Return a simple translation function
  return (key: TranslationKey): string => {
    return (translations[initialLang] as Record<string, string>)[key] || key;
  };
}

// Create a simple translator instance
export const t = createTranslator();

// For compatibility with existing code, provide a minimal useTranslation hook
export function useTranslation() {
  return { t };
}