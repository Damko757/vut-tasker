const FILTER_SETTINGS = "FILTER_SETTINGS";

// TODO: DBL/Long click to use-only
export const useHomeFilterMemory = () => {
  /** Fetches current state of saved items */
  const get = () => {
    const v = localStorage.getItem(FILTER_SETTINGS);
    if (!v) return null;

    return JSON.parse(v); // Implicit type
  };

  /** Saves pairs of settings to localStorage */
  const save = (pairs: Record<string, boolean>) => {
    localStorage.setItem(FILTER_SETTINGS, JSON.stringify(pairs));
  };
  return { get, save: save };
};
