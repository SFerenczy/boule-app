import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { overwriteGetLocale } from '$lib/paraglide/runtime.js';

// Pin locale to 'en' for deterministic test output
overwriteGetLocale(() => 'en');
