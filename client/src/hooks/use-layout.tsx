import { createContext, ReactNode, useContext, useState } from "react";

type Layout = "sidebar" | "topnav";

interface LayoutProviderProps {
  children: ReactNode;
  defaultLayout?: Layout;
  storageKey?: string;
}

interface LayoutProviderState {
  layout: Layout;
  setLayout: (layout: Layout) => void;
}

const initialState: LayoutProviderState = {
  layout: "sidebar",
  setLayout: () => null,
};

const LayoutContext = createContext<LayoutProviderState>(initialState);

export function LayoutProvider({
  children,
  defaultLayout = "sidebar",
  storageKey = "vite-ui-layout",
  ...props
}: LayoutProviderProps) {
  const [layout, setLayout] = useState<Layout>(
    () => (localStorage.getItem(storageKey) as Layout) || defaultLayout
  );

  const value = {
    layout,
    setLayout: (layout: Layout) => {
      localStorage.setItem(storageKey, layout);
      setLayout(layout);
    },
  };

  return (
    <LayoutContext.Provider {...props} value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => {
  const context = useContext(LayoutContext);

  if (context === undefined)
    throw new Error("useLayout must be used within a LayoutProvider");

  return context;
};
