export function initializeLicenseGuard() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response.status === 403 || response.status == 402) {
      window.location.replace("/license");
    }

    return response;
  };
}
