import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definição das chaves de tradução
export type TranslationKey = 
  | 'common.welcome'
  | 'common.login'
  | 'common.register'
  | 'common.logout'
  | 'common.email'
  | 'common.password'
  | 'common.name'
  | 'common.confirmPassword'
  | 'common.forgotPassword'
  | 'common.resetPassword'
  | 'common.submit'
  | 'common.cancel'
  | 'common.save'
  | 'common.edit'
  | 'common.delete'
  | 'common.back'
  | 'common.error'
  | 'common.success'
  | 'common.loading'
  | 'common.darkMode'
  | 'common.lightMode'
  | 'common.settings'
  | 'common.profile'
  | 'common.users'
  | 'common.dashboard'
  | 'common.adminPanel'
  | 'common.theme'
  | 'common.language'
  | 'common.authorized'
  | 'common.unauthorized'
  | 'common.active'
  | 'common.inactive'
  | 'common.expiration'
  | 'common.role'
  | 'common.createdAt'
  | 'common.actions'
  | 'common.layout'
  | 'auth.loginTitle'
  | 'auth.loginSubtitle'
  | 'auth.registerTitle'
  | 'auth.registerSubtitle'
  | 'auth.forgotPasswordTitle'
  | 'auth.forgotPasswordSubtitle'
  | 'auth.resetPasswordTitle'
  | 'auth.resetPasswordSubtitle'
  | 'auth.twoFactorTitle'
  | 'auth.twoFactorSubtitle'
  | 'auth.verifyCode'
  | 'auth.resendCode'
  | 'auth.loginSuccess'
  | 'auth.registerSuccess'
  | 'auth.logoutSuccess'
  | 'auth.passwordResetSuccess'
  | 'auth.pendingApproval'
  | 'auth.invalidCredentials'
  | 'auth.alreadyHaveAccount'
  | 'auth.dontHaveAccount'
  | 'profile.title'
  | 'profile.subtitle'
  | 'profile.changePassword'
  | 'profile.changePhoto'
  | 'profile.uploadPhoto'
  | 'profile.removePhoto'
  | 'profile.currentPassword'
  | 'profile.newPassword'
  | 'profile.confirmNewPassword'
  | 'profile.updateSuccess'
  | 'profile.passwordUpdateSuccess'
  | 'profile.photoUpdateSuccess'
  | 'settings.title'
  | 'settings.subtitle'
  | 'settings.themeSettings'
  | 'settings.languageSettings'
  | 'settings.accountSettings'
  | 'settings.interfaceSettings'
  | 'settings.defaultTheme'
  | 'settings.blueTheme'
  | 'settings.greenTheme'
  | 'settings.purpleTheme'
  | 'settings.orangeTheme'
  | 'settings.customAccentColor'
  | 'settings.portuguese'
  | 'settings.english'
  | 'settings.updateSuccess'
  | 'users.title'
  | 'users.subtitle'
  | 'users.addUser'
  | 'users.editUser'
  | 'users.deleteUser'
  | 'users.authorizeUser'
  | 'users.unauthorizeUser'
  | 'users.deleteConfirmation'
  | 'users.userAdded'
  | 'users.userUpdated'
  | 'users.userDeleted'
  | 'users.userAuthorized'
  | 'users.userUnauthorized'
  | 'users.adminRole'
  | 'users.userRole'
  | 'users.noExpirationDate'
  | 'welcome.title'
  | 'welcome.subtitle'
  | 'welcome.description'
  | 'welcome.getStarted';

export type Translations = Record<TranslationKey, string>;

// Traduções para português e inglês
export const translations: Record<string, Translations> = {
  pt: {
    'common.welcome': 'Bem-vindo',
    'common.login': 'Entrar',
    'common.register': 'Cadastrar',
    'common.logout': 'Sair',
    'common.email': 'Email',
    'common.password': 'Senha',
    'common.name': 'Nome',
    'common.confirmPassword': 'Confirmar senha',
    'common.forgotPassword': 'Esqueceu a senha?',
    'common.resetPassword': 'Redefinir senha',
    'common.submit': 'Enviar',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.back': 'Voltar',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.loading': 'Carregando',
    'common.darkMode': 'Modo escuro',
    'common.lightMode': 'Modo claro',
    'common.settings': 'Configurações',
    'common.profile': 'Perfil',
    'common.users': 'Usuários',
    'common.dashboard': 'Painel',
    'common.adminPanel': 'Painel de administração',
    'common.theme': 'Tema',
    'common.language': 'Idioma',
    'common.authorized': 'Autorizado',
    'common.unauthorized': 'Não autorizado',
    'common.active': 'Ativo',
    'common.inactive': 'Inativo',
    'common.expiration': 'Expiração',
    'common.role': 'Função',
    'common.createdAt': 'Criado em',
    'common.actions': 'Ações',
    'common.layout': 'Layout',
    
    'auth.loginTitle': 'Faça login na sua conta',
    'auth.loginSubtitle': 'Entre com suas credenciais para acessar o sistema',
    'auth.registerTitle': 'Crie uma nova conta',
    'auth.registerSubtitle': 'Preencha os dados abaixo para se cadastrar',
    'auth.forgotPasswordTitle': 'Esqueceu sua senha?',
    'auth.forgotPasswordSubtitle': 'Enviaremos um link para redefinir sua senha',
    'auth.resetPasswordTitle': 'Redefinir senha',
    'auth.resetPasswordSubtitle': 'Digite sua nova senha',
    'auth.twoFactorTitle': 'Verificação em duas etapas',
    'auth.twoFactorSubtitle': 'Digite o código enviado para seu email',
    'auth.verifyCode': 'Verificar código',
    'auth.resendCode': 'Reenviar código',
    'auth.loginSuccess': 'Login realizado com sucesso!',
    'auth.registerSuccess': 'Cadastro realizado com sucesso!',
    'auth.logoutSuccess': 'Logout realizado com sucesso!',
    'auth.passwordResetSuccess': 'Senha redefinida com sucesso!',
    'auth.pendingApproval': 'Sua conta está aguardando aprovação. Por favor, contate um administrador.',
    'auth.invalidCredentials': 'Email ou senha inválidos',
    'auth.alreadyHaveAccount': 'Já possui uma conta? Faça login',
    'auth.dontHaveAccount': 'Não possui uma conta? Cadastre-se',
    
    'profile.title': 'Seu perfil',
    'profile.subtitle': 'Gerencie suas informações pessoais',
    'profile.changePassword': 'Alterar senha',
    'profile.changePhoto': 'Alterar foto',
    'profile.uploadPhoto': 'Enviar foto',
    'profile.removePhoto': 'Remover foto',
    'profile.currentPassword': 'Senha atual',
    'profile.newPassword': 'Nova senha',
    'profile.confirmNewPassword': 'Confirmar nova senha',
    'profile.updateSuccess': 'Perfil atualizado com sucesso!',
    'profile.passwordUpdateSuccess': 'Senha atualizada com sucesso!',
    'profile.photoUpdateSuccess': 'Foto atualizada com sucesso!',
    
    'settings.title': 'Configurações',
    'settings.subtitle': 'Personalize sua experiência',
    'settings.themeSettings': 'Configurações de tema',
    'settings.languageSettings': 'Configurações de idioma',
    'settings.accountSettings': 'Configurações da conta',
    'settings.interfaceSettings': 'Configurações de interface',
    'settings.defaultTheme': 'Tema padrão',
    'settings.blueTheme': 'Tema azul',
    'settings.greenTheme': 'Tema verde',
    'settings.purpleTheme': 'Tema roxo',
    'settings.orangeTheme': 'Tema laranja',
    'settings.customAccentColor': 'Cor de destaque personalizada',
    'settings.portuguese': 'Português',
    'settings.english': 'Inglês',
    'settings.updateSuccess': 'Configurações atualizadas com sucesso!',
    
    'users.title': 'Gerenciamento de usuários',
    'users.subtitle': 'Gerencie os usuários do sistema',
    'users.addUser': 'Adicionar usuário',
    'users.editUser': 'Editar usuário',
    'users.deleteUser': 'Excluir usuário',
    'users.authorizeUser': 'Autorizar usuário',
    'users.unauthorizeUser': 'Desautorizar usuário',
    'users.deleteConfirmation': 'Tem certeza que deseja excluir este usuário?',
    'users.userAdded': 'Usuário adicionado com sucesso!',
    'users.userUpdated': 'Usuário atualizado com sucesso!',
    'users.userDeleted': 'Usuário excluído com sucesso!',
    'users.userAuthorized': 'Usuário autorizado com sucesso!',
    'users.userUnauthorized': 'Usuário desautorizado com sucesso!',
    'users.adminRole': 'Administrador',
    'users.userRole': 'Usuário',
    'users.noExpirationDate': 'Sem data de expiração',
    
    'welcome.title': 'Bem-vindo ao painel administrativo',
    'welcome.subtitle': 'Gerencie sua aplicação',
    'welcome.description': 'Este é um sistema completo de administração com autenticação, autorização e gerenciamento de usuários.',
    'welcome.getStarted': 'Começar'
  },
  
  en: {
    'common.welcome': 'Welcome',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.logout': 'Logout',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.name': 'Name',
    'common.confirmPassword': 'Confirm password',
    'common.forgotPassword': 'Forgot password?',
    'common.resetPassword': 'Reset password',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.loading': 'Loading',
    'common.darkMode': 'Dark mode',
    'common.lightMode': 'Light mode',
    'common.settings': 'Settings',
    'common.profile': 'Profile',
    'common.users': 'Users',
    'common.dashboard': 'Dashboard',
    'common.adminPanel': 'Admin panel',
    'common.theme': 'Theme',
    'common.language': 'Language',
    'common.authorized': 'Authorized',
    'common.unauthorized': 'Unauthorized',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.expiration': 'Expiration',
    'common.role': 'Role',
    'common.createdAt': 'Created at',
    'common.actions': 'Actions',
    'common.layout': 'Layout',
    
    'auth.loginTitle': 'Log in to your account',
    'auth.loginSubtitle': 'Enter your credentials to access the system',
    'auth.registerTitle': 'Create a new account',
    'auth.registerSubtitle': 'Fill in the details below to register',
    'auth.forgotPasswordTitle': 'Forgot your password?',
    'auth.forgotPasswordSubtitle': 'We\'ll send you a link to reset your password',
    'auth.resetPasswordTitle': 'Reset password',
    'auth.resetPasswordSubtitle': 'Enter your new password',
    'auth.twoFactorTitle': 'Two-factor verification',
    'auth.twoFactorSubtitle': 'Enter the code sent to your email',
    'auth.verifyCode': 'Verify code',
    'auth.resendCode': 'Resend code',
    'auth.loginSuccess': 'Login successful!',
    'auth.registerSuccess': 'Registration successful!',
    'auth.logoutSuccess': 'Logout successful!',
    'auth.passwordResetSuccess': 'Password reset successful!',
    'auth.pendingApproval': 'Your account is pending approval. Please contact an administrator.',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.alreadyHaveAccount': 'Already have an account? Login',
    'auth.dontHaveAccount': 'Don\'t have an account? Register',
    
    'profile.title': 'Your profile',
    'profile.subtitle': 'Manage your personal information',
    'profile.changePassword': 'Change password',
    'profile.changePhoto': 'Change photo',
    'profile.uploadPhoto': 'Upload photo',
    'profile.removePhoto': 'Remove photo',
    'profile.currentPassword': 'Current password',
    'profile.newPassword': 'New password',
    'profile.confirmNewPassword': 'Confirm new password',
    'profile.updateSuccess': 'Profile updated successfully!',
    'profile.passwordUpdateSuccess': 'Password updated successfully!',
    'profile.photoUpdateSuccess': 'Photo updated successfully!',
    
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your experience',
    'settings.themeSettings': 'Theme settings',
    'settings.languageSettings': 'Language settings',
    'settings.accountSettings': 'Account settings',
    'settings.interfaceSettings': 'Interface settings',
    'settings.defaultTheme': 'Default theme',
    'settings.blueTheme': 'Blue theme',
    'settings.greenTheme': 'Green theme',
    'settings.purpleTheme': 'Purple theme',
    'settings.orangeTheme': 'Orange theme',
    'settings.customAccentColor': 'Custom accent color',
    'settings.portuguese': 'Portuguese',
    'settings.english': 'English',
    'settings.updateSuccess': 'Settings updated successfully!',
    
    'users.title': 'User management',
    'users.subtitle': 'Manage system users',
    'users.addUser': 'Add user',
    'users.editUser': 'Edit user',
    'users.deleteUser': 'Delete user',
    'users.authorizeUser': 'Authorize user',
    'users.unauthorizeUser': 'Unauthorize user',
    'users.deleteConfirmation': 'Are you sure you want to delete this user?',
    'users.userAdded': 'User added successfully!',
    'users.userUpdated': 'User updated successfully!',
    'users.userDeleted': 'User deleted successfully!',
    'users.userAuthorized': 'User authorized successfully!',
    'users.userUnauthorized': 'User unauthorized successfully!',
    'users.adminRole': 'Administrator',
    'users.userRole': 'User',
    'users.noExpirationDate': 'No expiration date',
    
    'welcome.title': 'Welcome to the admin dashboard',
    'welcome.subtitle': 'Manage your application',
    'welcome.description': 'This is a complete administration system with authentication, authorization and user management.',
    'welcome.getStarted': 'Get started'
  }
};

// Interface para o contexto de idioma
type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: TranslationKey) => string;
};

// Criando o contexto com valor inicial null
const LanguageContext = createContext<LanguageContextType | null>(null);

// Componente Provider
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>('pt');

  useEffect(() => {
    // Tenta obter o idioma do navegador ou usa pt como padrão
    const browserLang = navigator.language.split('-')[0];
    const initialLang = browserLang === 'en' ? 'en' : 'pt';
    setLanguage(initialLang);
    
    // Armazena a preferência
    localStorage.setItem('preferredLanguage', initialLang);
  }, []);

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.pt[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}