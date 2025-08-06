// src/types/paypal.d.ts

// Prevents errors if this file is treated as a module
export {};

// Extend the global Window interface to include PayPal
declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        createOrder: (data: unknown, actions: unknown) => Promise<string>
        onApprove: (data: { orderID: string }, actions: unknown) => Promise<void>
        onError: (err: Error) => void
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
