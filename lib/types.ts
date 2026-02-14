export type AppManifest = {
  id: string;
  theme: any;
  pages: Record<string, any>;
  blocks: Record<string, any>;
  settings: {
    autoNav?: boolean;
    language?: string;
  };
};

export type Block = {
  id: string;
  kind: string;
  props: any;
};
