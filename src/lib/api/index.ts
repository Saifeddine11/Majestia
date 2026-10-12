/**
 * The single place where the data source of the public website is chosen.
 *
 * No Majestia backend or API contract was available when this was written,
 * so the demo adapter is used. To connect the real backend, write an adapter
 * that implements `MajestiaApi` (see `types.ts`) and export it here. No
 * component needs to change.
 */
import { mockApi } from "./mock-adapter";
import type { MajestiaApi } from "./types";

export const api: MajestiaApi = mockApi;

export type * from "./types";
