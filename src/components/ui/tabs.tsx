import React, { useState } from "react";

type TabsProps = {
  defaultValue: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
};

export const Tabs: React.FC<TabsProps> = ({ defaultValue, onValueChange, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onValueChange(value);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { activeTab, onTabChange: handleTabChange } as any);
      })}
    </div>
  );
};

type TabsListProps = {
  children: React.ReactNode;
  className?: string;
};

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, activeTab, onTabChange }) => (
  <button
    onClick={() => onTabChange(value)}
    className={activeTab === value ? "active" : ""}
  >
    {children}
  </button>
);

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  activeTab: string;
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, activeTab }) => (
  activeTab === value ? <div>{children}</div> : null
);