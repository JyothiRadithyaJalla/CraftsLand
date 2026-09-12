// Razorpay SDK Dynamic Script Loader with Singleton Promise & Timeout

let razorpayLoadPromise: Promise<boolean> | null = null;

export const loadRazorpayScript = (timeoutMs = 12000): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if ((window as any).Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayLoadPromise) {
    return razorpayLoadPromise;
  }

  razorpayLoadPromise = new Promise<boolean>((resolve) => {
    // Check if script element is already added to document
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    const timeout = setTimeout(() => {
      console.error('[RazorpayLoader] Checkout script load timed out.');
      resolve(false);
    }, timeoutMs);

    script.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    script.onerror = () => {
      clearTimeout(timeout);
      console.error('[RazorpayLoader] Failed to load Razorpay checkout script.');
      resolve(false);
    };

    document.body.appendChild(script);
  });

  return razorpayLoadPromise;
};
