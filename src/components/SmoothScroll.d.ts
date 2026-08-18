import { ReactNode } from 'react';
import Lenis from 'lenis';
export declare function getLenisInstance(): Lenis | null;
interface SmoothScrollProps {
    children: ReactNode;
}
export default function SmoothScroll({ children }: SmoothScrollProps): import("react").JSX.Element;
export {};
