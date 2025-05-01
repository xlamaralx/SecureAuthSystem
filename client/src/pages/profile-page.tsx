import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Palette, Upload, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HexColorPicker } from "react-colorful";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This would be implemented with a mutation to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: t('profile.updateSuccess'),
        description: new Date().toLocaleDateString(),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: t('common.error'),
        description: "As senhas não correspondem",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would be implemented with a mutation to update the password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: t('profile.passwordUpdateSuccess'),
        description: new Date().toLocaleDateString(),
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('profile.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('profile.subtitle')}</p>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-80 h-fit">
          <CardHeader>
            <CardTitle>{t('common.profile')}</CardTitle>
            <CardDescription>{user.role}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              {profileImage && (
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="profile-image">{t('profile.uploadPhoto')}</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button asChild className="w-full">
                  <label htmlFor="profile-image" className="cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    {t('profile.changePhoto')}
                  </label>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{t('profile.title')}</CardTitle>
            <CardDescription>{t('profile.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info">
              <TabsList className="mb-4">
                <TabsTrigger value="info">{t('common.profile')}</TabsTrigger>
                <TabsTrigger value="password">{t('profile.changePassword')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('common.name')}</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('common.name')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('common.email')}</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('common.email')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accent-color">Cor de destaque</Label>
                      <div 
                        className="h-8 w-8 rounded-full border border-border cursor-pointer"
                        style={{ backgroundColor: accentColor }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      />
                    </div>
                    
                    {showColorPicker && (
                      <div className="mt-2 relative z-10">
                        <div 
                          className="fixed inset-0" 
                          onClick={() => setShowColorPicker(false)}
                        />
                        <div className="absolute right-0">
                          <HexColorPicker color={accentColor} onChange={setAccentColor} />
                          <div className="flex items-center justify-between mt-2 bg-background p-2 rounded-md border">
                            <div className="text-sm font-medium">{accentColor}</div>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => {
                                // Apply the color to CSS variables
                                document.documentElement.style.setProperty('--color-primary', accentColor);
                                setShowColorPicker(false);
                                
                                toast({
                                  title: "Cor aplicada",
                                  description: "A cor de destaque foi atualizada",
                                });
                              }}
                            >
                              Aplicar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTheme("light")}
                        type="button"
                      >
                        Claro
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTheme("dark")}
                        type="button"
                      >
                        Escuro
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('common.save')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="password">
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">{t('profile.currentPassword')}</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{t('profile.newPassword')}</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t('profile.confirmNewPassword')}</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('common.save')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}