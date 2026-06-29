"use client";

import { createContext, useContext, useState } from "react";

export type TabsContextType = {
  activeTab: string | null;
  setActiveTab: (tab: string) => void;
  isOnClickScrolling: boolean;
  setIsOnClickScrolling: (isOnClickScrolling: boolean) => void;
};

const TabsContext = createContext<TabsContextType>({
  activeTab: null,
  setActiveTab: () => {},
  isOnClickScrolling: false,
  setIsOnClickScrolling: () => {},
});

export function useTabs() {
  return useContext(TabsContext);
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isOnClickScrolling, setIsOnClickScrolling] = useState<boolean>(false);

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isOnClickScrolling,
        setIsOnClickScrolling,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}
