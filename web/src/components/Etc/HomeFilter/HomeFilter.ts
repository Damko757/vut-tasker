const SHOW_FILTER = "SHOW_FILTER";
// Loads from localStrorage preferences
export const loadFilterValue = (
  letterSuffix: string,
  defaultValue: boolean,
) => {
  const v = localStorage.getItem(SHOW_FILTER + "_" + letterSuffix);
  if (v === null || v === "") return defaultValue;

  return v == "1" ? true : false; // Implicit type
};

export const saveFilterValue = (letterSuffix: string, value: boolean) => {
  localStorage.setItem(SHOW_FILTER + "_" + letterSuffix, value ? "1" : "0");
};

// TODO: Remebember selected options
// TODO: DBL/Long click to use-only
export const filterState = (newValue: string | undefined = undefined) => {
  if (newValue !== undefined) {
    localStorage.setItem(SHOW_FILTER, newValue);
  }

  return localStorage.getItem(SHOW_FILTER);
};
