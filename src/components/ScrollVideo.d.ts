interface ScrollVideoProps {
    src: string;
    onDurationChange?: (duration: number) => void;
    onProgress?: (progress: number) => void;
}
export default function ScrollVideo({ src, onDurationChange, onProgress }: ScrollVideoProps): import("react").JSX.Element;
export {};
