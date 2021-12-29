import { IconBase, IconBaseProps } from "react-icons";
import { theme } from "styles/theme";

export function AppIcon(props: IconBaseProps) {
  return (
    <IconBase {...props} viewBox="0 0 420 420">
      <path
        fill={theme.colors.blue[500]}
        d="M197 159.64c-6.97 2.63-11.74 6.86-13.47 14.36-2.14 9.24 2.91 15.33-8.53 21.17-12.83 6.53-14.46-5.38-25-9.69-12.03-4.91-19.93 1.45-28 9.52-3.7 3.7-7.5 7.05-9.52 12-2.6 6.37-1.78 14.35 2.17 20 5.36 7.68 13.16 9.99 7.52 21-5.86 11.42-12.83 6.6-21.17 8.53-9.61 2.22-14.87 9.93-15 19.47-.15 11.67-2.5 25.78 9 33.01 11.28 7.08 21.71-3.24 28.07 12.99 4.34 11.09-6.42 12.8-10.59 23-4.91 12.03 1.45 19.93 9.52 28 2.28 2.28 5.42 5.55 8 7.35 6.99 4.89 17.01 4.89 24 0 7.27-5.08 9.61-12.62 20-8 12.54 5.58 7.28 11.95 9.53 21.65 2.22 9.61 9.93 14.87 19.47 15 10.8.14 23.94 2.29 31.61-7.04 9.62-11.71-2.63-23.57 14.39-30.02 1.93-.73 3.94-1.18 6-.84 6.45 1.07 9.1 8.19 17 11.42 12.01 4.91 20.93-2.45 29-10.52 3.12-3.12 6.17-5.95 8.08-10 3.11-6.57 2.43-15.04-1.73-21-5.1-7.31-12.64-9.71-8-20 5.68-12.58 11.87-7.27 21.65-9.53 6.23-1.44 11.11-5.61 13.64-11.47 1.27-2.96 1.31-4.86 1.36-8 .15-11.67 2.5-25.78-9-33.01-11.28-7.08-21.71 3.24-28.07-12.99-4.34-11.09 6.42-12.8 10.59-23 4.91-12.03-1.45-19.93-9.52-28-2.28-2.28-5.42-5.55-8-7.35-6.99-4.89-17.01-4.89-24 0-6.78 4.73-9.29 12.1-19 8.41-15.64-5.95-6.52-16.28-12.41-27.06-5.97-10.92-15.06-10-25.59-10-4.69 0-9.39-.29-14 .64zm8 70.65c9.86-.93 19.94.48 29 4.61 31.24 14.25 40.15 53.64 20.79 81.1-4.52 6.42-9.11 10.34-15.79 14.38-6.81 4.13-14.13 6.37-22 7.33-43.2 5.32-74.68-41.9-53.56-79.71 2.83-5.07 6.27-9.9 10.57-13.83 9.24-8.44 18.86-12.03 30.99-13.88z"
      />
      <path
        fill={theme.colors.green[500]}
        d="M52.04 111.74c-9.34 5.39-3.21 12.9-10.1 16.03-4.29 1.94-6.66-2.44-10.94-4.03-7.29-2.73-15.76 3.68-18.26 10.26-1.24 3.27-.73 7.02.98 10 1.66 2.9 4.73 5.23 3.05 8.94-2.25 4.95-7.73 3.38-11.73 5.51C-.82 161.58-.07 167.32 0 173c.07 5.21.66 8.74 6.02 10.99 3.85 1.62 8.61.35 10.75 5.07 1.68 3.71-1.39 6.04-3.04 8.94-2.16 3.74-2.29 8.28 0 12 3.53 5.69 10.33 10.85 17.27 8.26 3.96-1.48 6.2-5.28 9.98-4.38 5.79 1.39 4.33 8.05 6.47 12.08 2.7 5.04 6.51 5.02 11.55 5.04 5 .02 9.82.63 12.99-4.11 2.89-4.3.94-11.55 7.03-13.01 3.22-.77 5.46 1.96 7.98 3.4 3.31 1.9 7.52 2.28 11 .55 6.16-3.08 11.93-10.7 9.26-17.83-1.59-4.28-5.97-6.65-4.03-10.94 2.4-5.29 8.14-3.04 12.66-6.07 1.59-1.06 2.65-2.25 3.37-4.03 1.42-3.51 1.26-14.68-1-17.75-4.52-6.16-13.68-2.13-15.38-9.23-.9-3.78 2.9-6.02 4.38-9.98 2.67-7.13-3.1-14.75-9.26-17.83-3.48-1.73-7.69-1.35-11 .55-2.9 1.66-5.23 4.73-8.94 3.05-5.29-2.4-3.04-8.14-6.07-12.66-3.64-5.45-14.28-4.77-19.95-3.37zM58 145.3c28.1-1.47 37.78 34.75 15 47.82a28.013 28.013 0 01-11 3.58c-18.14 1.95-31.98-16.87-26.4-33.7 3.59-10.84 11.57-15.94 22.4-17.7z"
      />
      <path
        fill={theme.colors.amber[500]}
        d="M172 10.66c-4.35 1.81-7.06 3.8-8.85 8.34-1.66 4.19-.47 8.27-5.21 10.82-6.91 3.74-10.43-5.05-15.95-7.34-9.32-3.86-24 6.82-24.69 16.52-.54 7.68 6.95 11.63 5.55 17-3.06 11.75-16.08.54-22.71 12.04-1.75 3.03-1.9 6.58-2.21 9.96-.65 6.95-1.71 11.51 5.11 16.3 5.31 3.73 13.07 1.34 14.47 8.7.9 4.72-3.53 7.31-5.87 10.28-3.24 4.14-4.2 8.84-2.11 13.72 2.93 6.83 11.15 16.19 19.47 14.45 4.9-1.02 8.29-4.6 11-5.31 3.42-.89 7.94 1.93 8.88 5.3.88 3.16-2.64 15.07 9.12 18.62 2.85.86 5.15.8 8 1.1 6.99.74 11.79.86 15.91-6.18 2.47-4.2 1.26-10.22 6.15-12.8 6.69-3.53 9.32 4.59 15.95 7.34 9.13 3.77 24.01-6.97 24.69-16.52.54-7.68-6.95-11.63-5.55-17 2.07-7.98 8.11-5.31 13.85-6.21 5.16-.81 8.56-3.81 10.06-8.79.86-2.85.8-5.15 1.1-8 .74-6.99.86-11.79-6.18-15.91-4.54-2.67-11.1-1.11-13.22-7.11-2.55-7.18 6.96-8.58 8.67-17.98 1.53-8.35-9.82-21.96-18.43-21.71-5.67.16-10.05 4.8-13 5.57-1.9.5-3.3.07-4.97-.87-7.82-4.42-1.18-10.29-6.04-17.95-3.86-6.09-16.47-7.45-22.99-6.38zm-3 43.63c4.82-.44 11.5.09 16 1.9 32.78 13.16 22.6 63.74-13 61.72-7.59-.43-15.27-2.8-20.91-8.1-12.63-11.83-13.58-34.42-1-46.64 5.38-5.22 11.66-7.66 18.91-8.88z"
      />
      <path
        fill={theme.colors.red[500]}
        d="M296.04 65.74c-9.34 5.39-3.21 12.9-10.1 16.03-4.29 1.94-6.66-2.44-10.94-4.03-7.29-2.73-15.76 3.68-18.26 10.26-1.24 3.27-.73 7.02.98 10 1.66 2.9 4.73 5.23 3.05 8.94-2.25 4.95-7.73 3.38-11.73 5.51-5.86 3.13-5.11 8.87-5.04 14.55.07 5.21.66 8.74 6.02 10.99 3.85 1.62 8.61.35 10.75 5.07 1.68 3.71-1.39 6.04-3.04 8.94-2.16 3.74-2.29 8.28 0 12 3.53 5.69 10.33 10.85 17.27 8.26 3.96-1.48 6.2-5.28 9.98-4.38 5.79 1.39 4.33 8.05 6.47 12.08 2.7 5.04 6.51 5.02 11.55 5.04 5 .02 9.82.63 12.99-4.11 2.89-4.3.94-11.55 7.03-13.01 3.22-.77 5.46 1.96 7.98 3.4 3.31 1.9 7.52 2.28 11 .55 6.16-3.08 11.93-10.7 9.26-17.83-1.59-4.28-5.97-6.65-4.03-10.94 2.4-5.29 8.14-3.04 12.66-6.07 1.59-1.06 2.65-2.25 3.37-4.03 1.42-3.51 1.26-14.68-1-17.75-4.52-6.16-13.68-2.13-15.38-9.23-.9-3.78 2.9-6.02 4.38-9.98 2.67-7.13-3.1-14.75-9.26-17.83-3.48-1.73-7.69-1.35-11 .55-2.9 1.66-5.23 4.73-8.94 3.05-5.29-2.4-3.04-8.14-6.07-12.66-3.64-5.45-14.28-4.77-19.95-3.37zM302 99.3c28.1-1.47 37.78 34.75 15 47.82a28.013 28.013 0 01-11 3.58c-18.14 1.95-31.98-16.87-26.4-33.7 3.59-10.84 11.57-15.94 22.4-17.7z"
      />
      <path
        fill={theme.colors.lightBlue[500]}
        d="M360 171.48c-4.53.95-9.34 1.66-11.26 6.54-1.59 4.02.94 8.61-2.92 11.33-3.15 2.21-5.99-.42-9.82-.57-6.34-.24-12.18 7.45-12.36 13.22-.24 8.09 9.39 8.72 6.86 14.86-1.41 3.43-5.15 2.99-7.63 5.62-3.9 3.97-2.66 12.19 0 16.41 4.71 7.22 11.93 1.24 15.48 6.29 2.21 3.15-.42 5.99-.57 9.82-.22 5.84 5.16 9.99 10.22 11.75 3.66 1.27 6.77.54 9.63-2.03 2.25-2.03 3.62-5.23 7.33-4.49 3.65.73 3.98 4.39 5.31 6.44 2.25 3.49 5.81 4.43 9.73 3.85 4.85-.71 10.15-2.23 11.57-7.52.94-3.54-.99-7.82 2.61-10.11 2.9-2.27 5.81-.15 8.82 0 4.08.76 6.88-.81 9.39-3.95 3.07-3.83 5.48-9.21 2.67-13.84-2.06-3.41-6.69-4.75-5.83-9.06.82-4.13 5.48-3.94 7.97-6.52 4.06-4.2 2.51-14.32-1.5-18.09-5.02-4.71-12 .37-14.55-5.5-1.24-2.84.94-5.43 1.07-8.93.23-5.99-5.89-10.72-11.22-12.06-9.17-2.31-9.96 8.02-15.96 6.83-3.96-.79-3.82-4.73-5.86-7.24-2.54-3.12-5.5-3.36-9.18-3.05zm7 28.84c3.39-.35 6.91-.48 10.17.73 21.46 7.93 17.43 42.11-9.08 40.85-13.37-.63-22.64-15.63-18.04-28.07 3.06-8.3 8.77-11.72 16.95-13.51z"
      />
    </IconBase>
  );
}
