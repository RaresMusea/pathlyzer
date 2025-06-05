import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

global.IntersectionObserver = class IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];
    constructor(public callback: any, public options?: any) { }
    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords(): any[] { return []; }
};