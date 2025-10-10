declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        send_to?: string;
        transaction_id?: string;
        value?: number;
        currency?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

export {};
