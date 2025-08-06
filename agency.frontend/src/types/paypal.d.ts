// src/types/paypal.d.ts

// Prevents errors if this file is treated as a module
export {};

// Extend the global Window interface to include PayPal
declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        style?: {
          layout?: string;
          color?: string;
          shape?: string;
          label?: string;
          height?: number;
        };
        createOrder: (data: unknown, actions: unknown) => Promise<string>
        onApprove: (data: { orderID: string }, actions: unknown) => Promise<void>
        onError: (err: Error) => void
        onCancel?: () => void;
      }) => {
        render: (selector: string) => void;
      };
      FUNDING: {
        CARD: string;
        [key: string]: string; // Optional: allow other funding sources like PAYPAL, CREDIT, etc.
      };
    };
  }

  namespace paypal {
    interface ButtonsActions {
      order: {
        create: (orderData: {
          purchase_units: Array<{
            amount: {
              value: string;
              currency_code: string;
            };
            description?: string;
          }>;
        }) => Promise<string>;
        capture: () => Promise<{
          id: string;
          payer: {
            name: {
              given_name: string;
              surname: string;
            };
            email_address: string;
          };
        }>;
      };
    }
  }
}
