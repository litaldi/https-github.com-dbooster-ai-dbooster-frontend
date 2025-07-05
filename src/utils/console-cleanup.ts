// Production Console Management
// Remove all console.log statements in production builds

export const productionSafeConsole = {
  log: import.meta.env.PROD ? () => {} : console.log,
  warn: import.meta.env.PROD ? () => {} : console.warn,
  error: console.error, // Always keep errors
  info: import.meta.env.PROD ? () => {} : console.info,
  debug: import.meta.env.PROD ? () => {} : console.debug,
  group: import.meta.env.PROD ? () => {} : console.group,
  groupEnd: import.meta.env.PROD ? () => {} : console.groupEnd,
  table: import.meta.env.PROD ? () => {} : console.table,
  time: import.meta.env.PROD ? () => {} : console.time,
  timeEnd: import.meta.env.PROD ? () => {} : console.timeEnd,
};

// Global replacement in production
if (import.meta.env.PROD) {
  // Override console methods in production
  const noop = () => {};
  Object.assign(console, {
    log: noop,
    info: noop,
    debug: noop,
    warn: noop,
    // Keep error for critical issues
    // error: console.error,
    group: noop,
    groupEnd: noop,
    table: noop,
    time: noop,
    timeEnd: noop,
  });
}
