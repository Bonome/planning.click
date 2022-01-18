import { writable } from 'svelte/store';

export const selected_event = writable(0);

export const number_week_displayed = writable(0);

export const planning_start_date = writable(0);

export const last_disabled_date_processed = writable(0);

export const disabled_days = writable(0);

export const off = writable(0);

export const firstWeekContainsDate = writable(0);
//export const slug = 