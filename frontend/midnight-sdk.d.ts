declare module '@midnight-ntwrk/dapp-connector-api' {
  export interface DAppConnectorAPI {
    apiVersion: string;
    name: string;
    icon?: string;
    isEnabled(): Promise<boolean>;
    enable(): Promise<any>;
  }
}

declare module '@midnight-ntwrk/midnight-js-network-provider' {
  export type NetworkId = 'undeployed' | 'devnet' | 'testnet' | 'mainnet' | string;
}
