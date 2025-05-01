import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useLayout } from "@/hooks/use-layout";
import { useTranslation } from "@/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { Palette, Layout, Languages, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Uso do componente react-colorful, vamos instalar se precisar
const ColorPicker = ({ color, onChange }: { color: string; onChange: (color: string) => void }) => {
  return (
    <div className="space-y-2">
      <HexColorPicker color={color} onChange={onChange} />
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded-md border"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-9 w-24 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { layout, setLayout } = useLayout();
  const { language, setLanguage, t } = useTranslation();
  const { toast } = useToast();
  const [userTheme, setUserTheme] = useState<string>("default");
  const [accentColor, setAccentColor] = useState<string>("#3498db");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserTheme(user.theme || "default");
      setAccentColor(user.accentColor || "#3498db");
    }
  }, [user]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // This would be a mutation to update user settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: t('settings.updateSuccess'),
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('settings.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('settings.subtitle')}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t('settings.themeSettings')}
            </CardTitle>
            <CardDescription>{t('settings.interfaceSettings')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>{t('common.theme')}</Label>
              <RadioGroup 
                value={userTheme} 
                onValueChange={setUserTheme}
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
              >
                <div className="flex flex-col items-center gap-2">
                  <RadioGroupItem value="default" id="theme-default" className="sr-only" />
                  <Label
                    htmlFor="theme-default"
                    className={`cursor-pointer flex flex-col items-center gap-1 rounded-md border-2 p-2 ${
                      userTheme === "default" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      {userTheme === "default" && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <span>{t('settings.defaultTheme')}</span>
                  </Label>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <RadioGroupItem value="blue" id="theme-blue" className="sr-only" />
                  <Label
                    htmlFor="theme-blue"
                    className={`cursor-pointer flex flex-col items-center gap-1 rounded-md border-2 p-2 ${
                      userTheme === "blue" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      {userTheme === "blue" && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <span>{t('settings.blueTheme')}</span>
                  </Label>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <RadioGroupItem value="green" id="theme-green" className="sr-only" />
                  <Label
                    htmlFor="theme-green"
                    className={`cursor-pointer flex flex-col items-center gap-1 rounded-md border-2 p-2 ${
                      userTheme === "green" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      {userTheme === "green" && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <span>{t('settings.greenTheme')}</span>
                  </Label>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <RadioGroupItem value="purple" id="theme-purple" className="sr-only" />
                  <Label
                    htmlFor="theme-purple"
                    className={`cursor-pointer flex flex-col items-center gap-1 rounded-md border-2 p-2 ${
                      userTheme === "purple" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                      {userTheme === "purple" && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <span>{t('settings.purpleTheme')}</span>
                  </Label>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <RadioGroupItem value="orange" id="theme-orange" className="sr-only" />
                  <Label
                    htmlFor="theme-orange"
                    className={`cursor-pointer flex flex-col items-center gap-1 rounded-md border-2 p-2 ${
                      userTheme === "orange" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                      {userTheme === "orange" && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <span>{t('settings.orangeTheme')}</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <Label>{t('settings.customAccentColor')}</Label>
              <div className="flex flex-col items-start gap-2">
                <div className="w-full max-w-[200px]">
                  <div
                    className="h-6 w-full rounded-md"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>{t('common.darkMode')}</Label>
              <RadioGroup 
                value={theme} 
                onValueChange={setTheme}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="dark" id="dark-mode" />
                  <Label htmlFor="dark-mode">{t('common.darkMode')}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="light" id="light-mode" />
                  <Label htmlFor="light-mode">{t('common.lightMode')}</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                {t('settings.interfaceSettings')}
              </CardTitle>
              <CardDescription>{t('settings.interfaceSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>{t('common.layout')}</Label>
                <RadioGroup 
                  value={layout} 
                  onValueChange={setLayout}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="sidebar" id="sidebar-layout" />
                    <Label htmlFor="sidebar-layout">Sidebar</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="topnav" id="topnav-layout" />
                    <Label htmlFor="topnav-layout">Top navigation</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                {t('settings.languageSettings')}
              </CardTitle>
              <CardDescription>{t('settings.languageSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>{t('common.language')}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('common.language')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">{t('settings.portuguese')}</SelectItem>
                    <SelectItem value="en">{t('settings.english')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}