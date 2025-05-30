
import {
    AlertTriangle,
    ArrowRight,
    Check,
    ChevronLeft,
    ChevronRight,
    Command,
    CreditCard,
    File,
    FileText,
    HelpCircle,
    Image,
    Laptop,
    Loader2,
    Moon,
    MoreVertical,
    Pizza,
    Plus,
    Settings,
    SunMedium,
    Trash,
    Twitter,
    User,
    X,
    CheckCircle2, // Added for success icon
    XCircle, // Added for error icon
    type LucideIcon
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
    logo: Command,
    close: X,
    spinner: Loader2,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    trash: Trash,
    post: FileText,
    page: File,
    media: Image,
    settings: Settings,
    billing: CreditCard,
    ellipsis: MoreVertical,
    add: Plus,
    warning: AlertTriangle,
    user: User,
    arrowRight: ArrowRight,
    help: HelpCircle,
    pizza: Pizza,
    sun: SunMedium,
    moon: Moon,
    laptop: Laptop,
    shield: AlertTriangle,
    success: CheckCircle2, // Added success icon
    error: XCircle, // Added error icon
    stripe: (props: any) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            fill="currentColor"
            {...props}
        >
            <path d="M165 144.7l-43.3 9.2-.2 142.4c0 26.3 19.8 43.3 46.1 43.3 14.6 0 25.3-2.7 31.2-5.9v-33.8c-5.7 2.3-33.7 10.5-33.7-15.7V221h33.7v-37.8h-33.7zm89.1 51.6l-2.7-13.1H213v153.2h44.3V233.3c10.5-13.8 28.2-11.1 33.9-9.3v-40.8c-6-2.1-26.7-6-37.1 13.1zm92.3-72.3l-44.6 9.5v36.2l44.6-9.5zM44.9 228.3c0-6.9 5.8-9.6 15.1-9.7 13.5 0 30.7 4.1 44.2 11.4v-41.8c-14.7-5.8-29.4-8.1-44.1-8.1-36 0-60 18.8-60 50.2 0 49.2 67.5 41.2 67.5 62.4 0 8.2-7.1 10.9-17 10.9-14.7 0-33.7-6.1-48.6-14.2v40c16.5 7.1 33.2 10.1 48.5 10.1 36.9 0 62.3-15.8 62.3-47.8 0-52.9-67.9-43.4-67.9-63.4zM640 261.6c0-45.5-22-81.4-64.2-81.4s-67.9 35.9-67.9 81.1c0 53.5 30.3 78.2 73.5 78.2 21.2 0 37.1-4.8 49.2-11.5v-33.4c-12.1 6.1-26 9.8-43.6 9.8-17.3 0-32.5-6.1-34.5-26.9h86.9c.2-2.3.6-11.6.6-15.9zm-87.9-16.8c0-20 12.3-28.4 23.4-28.4 10.9 0 22.5 8.4 22.5 28.4zm-112.9-64.6c-17.4 0-28.6 8.2-34.8 13.9l-2.3-11H363v204.8l44.4-9.4.1-50.2c6.4 4.7 15.9 11.2 31.4 11.2 31.8 0 60.8-23.2 60.8-79.6.1-51.6-29.3-79.7-60.5-79.7zm-10.6 122.5c-10.4 0-16.6-3.8-20.9-8.4l-.3-66c4.6-5.1 11-8.8 21.2-8.8 16.2 0 27.4 18.2 27.4 41.4.1 23.9-10.9 41.8-27.4 41.8zm-126.7 33.7h44.6V183.2h-44.6z"/>
        </svg>
    ),
    paypal: (props: any) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill="currentColor"
            {...props}
        >
            <path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"/>
        </svg>
    ),
    googlePay: (props: any) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            fill="currentColor"
            {...props}
        >
            <path d="M105.72,215v41.25h57.1a49.66,49.66,0,0,1-21.14,32.6c-9.54,6.55-21.72,10.28-36,10.28-27.6,0-50.93-18.91-59.3-44.22a65.61,65.61,0,0,1,0-41l0,0c8.37-25.46,31.7-44.37,59.3-44.37a56.43,56.43,0,0,1,40.51,16.08L176.47,155a96.42,96.42,0,0,0-68.15-26.63,105.24,105.24,0,0,0-94.81,58.82,107.35,107.35,0,0,0,0,95.9c19.32,43,63.31,71.91,111.44,71.91,34.14,0,63.27-11.64,83.93-31.55s31.83-48.86,31.83-83.29c0-7.76-.51-13.72-1.79-19.08H105.72Z"/>
            <path d="M350.93,187.71h38.64V225h.75c8.51-15.39,24.53-27.48,49.3-27.48,47.78,0,62.09,22.75,62.09,71.28V392.23H455.07V280.51c0-26.09-12.12-40.61-34.64-40.61-21.51,0-36.86,15.39-36.86,40.61V392.23H336.93V187.71Z"/>
            <path d="M584.21,392.23H537.93V187.71h46.28Z"/>
        </svg>
    ),
    visa: (props: any) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="none"
        >
            <path
                fill="#1A1F71"
                d="M44 24c0 11.046-8.954 20-20 20S4 35.046 4 24 12.954 4 24 4s20 8.954 20 20z"
            />
            <path
                fill="#fff"
                d="M20.5 28.5h-3l1.8-11h3l-1.8 11zm8.6-10.7c-.6-.2-1.5-.5-2.6-.5-2.9 0-4.9 1.5-4.9 3.6 0 1.6 1.4 2.4 2.5 2.9 1.1.5 1.5.9 1.5 1.3 0 .7-.9 1-1.7 1-1.1 0-1.7-.2-2.7-.5l-.4-.2-.4 2.4c.7.3 1.9.6 3.2.6 3 0 5-1.5 5-3.7 0-1.2-.8-2.2-2.5-3-.9-.5-1.5-.8-1.5-1.3 0-.4.5-.9 1.6-.9.9 0 1.6.2 2.1.4l.3.1.5-2.2zm4.9-.3h-2.3c-.7 0-1.2.2-1.5.9l-4.3 10.1h3l.6-1.6h3.7c.1.3.4 1.6.4 1.6h2.6l-2.2-11zm-3.7 7.1l1.2-3c0 .1.2-.6.4-1l.2 1 .7 3h-2.5z"
            />
        </svg>
    ),
    mastercard: (props: any) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="none"
        >
            <circle cx="17" cy="24" r="14" fill="#EA001B" />
            <circle cx="31" cy="24" r="14" fill="#FFA200" opacity=".8" />
        </svg>
    ),
    skrill: CreditCard,
    mercadoPago: (props: any) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="none"
        >
            <path
                fill="#00B1EA"
                d="M24 4c11.046 0 20 8.954 20 20s-8.954 20-20 20S4 35.046 4 24 12.954 4 24 4z"
            />
            <path
                fill="#fff"
                d="M31.5 21.5h-15v2h15v-2zm0 4h-15v2h15v-2z"
            />
        </svg>
    ),
    creditCard: CreditCard
}; 
