import { cn } from "~/core/classNames";

export function BubbleShape({
  className,
  style,
  isDouble = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  isDouble?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1028 404"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, "overflow-visible", {
        "stroke-yellow-base": isDouble,
        "stroke-gray-300": !isDouble,
      })}
      style={style}
    >
      <path
        d={isDouble ? doublePath : simplePath}
        strokeWidth="3"
        strokeLinecap="round"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const simplePath =
  "m65.6001 8.61046c-79.2714 62.95734-70.36491 234.76354-48.0095 284.44254 58.1954 129.324 264.6104 104.011 503.5414 104.011 179.467 0 329.367 21.466 459.439-25.132 72.419-25.944 47.449-278.0685 0-305.1583-77.841-44.4388-277.878-64.05036-477.861-64.5373 0 0-442.6924-5.57726-480.6533 37.4476";

const doublePath =
  "m67.8155 9.37992c.6539-.50863.7717-1.45105.263-2.10495-.5086-.6539-1.451-.77167-2.1049-.26304zm-48.5707 275.30908 1.3934-.555zm955.7632 76.675.515 1.409zm0-296.6303.732-1.3092zm-474.28-62.7337.004-1.499996-.008-.000019-.008.000066zm-464.2663 333.561-1.2068.891zm597.6733 56.089-.232 1.482zm337.449-339.7973.789-1.276zm-470.856-34.5667.079 1.4979zm-434.7544-10.27407c-39.8546 31.00027-56.7313 88.34187-61.27549 143.75707-4.547285 55.453 3.2107 109.526 13.15329 134.476l2.7868-1.111c-9.7177-24.385-17.47345-77.959-12.95012-133.12 4.52642-55.1986 21.30472-111.4364 60.12742-141.63408zm909.5494 355.76107c18.621-6.815 30.677-27.649 37.737-54.718 7.08-27.174 9.26-61.129 7.73-95.014-1.53-33.894-6.78-67.815-14.61-94.946-3.92-13.564-8.495-25.4729-13.6-34.846-5.085-9.3369-10.786-16.3275-17.04-19.8245l-1.464 2.6185c5.519 3.0861 10.883 9.4847 15.869 18.6408 4.967 9.1199 9.469 20.8082 13.345 34.2432 7.76 26.866 12.98 60.549 14.5 94.249 1.52 33.71-.66 67.339-7.64 94.122-7.01 26.889-18.718 46.385-35.858 52.658zm-957.6716-77.528c15.5627 39.052 39.9388 64.647 71.4852 81.008 31.4954 16.334 70.0524 23.421 113.9364 25.652 43.888 2.231 93.243-.389 146.377-3.559 53.161-3.171 110.131-6.895 169.362-6.895v-3c-59.339 0-116.408 3.731-169.541 6.901-53.159 3.171-102.35 5.779-146.046 3.557-43.699-2.222-81.762-9.27-112.7072-25.319-30.8938-16.023-54.7782-41.06-70.0796-79.456zm501.1606 96.206c44.493 0 87.159 1.79 128.169 3.738 40.999 1.948 80.36 4.055 118.188 4.685 75.655 1.259 145.344-3.384 210.154-27.101l-1.031-2.817c-64.287 23.526-133.534 28.176-209.073 26.918-37.768-.629-77.068-2.733-118.095-4.682-41.017-1.948-83.744-3.741-128.312-3.741zm456.728-318.0265c-38.911-21.756-108.125-37.3429-192.231-47.568-84.177-10.23378-183.495-15.119733-282.777-15.356496l-.008 2.999996c99.202.23657 198.396 5.11903 282.423 15.3346 84.098 10.2242 152.782 25.7675 191.129 47.2084zm-475.012-61.4245c-.012-1.499949-.014-1.499935-.017-1.499907-.004.000027-.008.000067-.015.000122-.013.000108-.032.000272-.057.000493-.051.000441-.127.00111-.228.002025-.201.001828-.502.004636-.899.008556-.793.00784-1.97.02013-3.507.037933-3.073.035608-7.585.093274-13.341.181517-11.511.176485-27.997.475281-47.897.964561-39.8.97853-93.262 2.71907-147.906 5.76723-54.637 3.04777-110.486 7.40447-155.047 13.61917-22.277 3.1068-41.7727 6.6833-56.9011 10.8048-7.5636 2.0605-14.0694 4.2664-19.2996 6.6335-5.2059 2.3561-9.2658 4.9235-11.824 7.7633l2.2289 2.0079c2.1513-2.388 5.7734-4.7487 10.832-7.0381 5.0342-2.2784 11.3754-4.4355 18.8513-6.4721 14.9506-4.0731 34.3035-7.6288 56.5265-10.7281 44.438-6.1975 100.19-10.5488 154.8-13.595 54.603-3.04587 108.032-4.78543 147.813-5.7635 19.889-.48902 36.366-.78765 47.869-.96401 5.752-.08819 10.26-.1458 13.33-.18137 1.535-.01778 2.711-.03005 3.502-.03788.396-.00391.696-.00671.896-.00853.101-.00091.176-.00158.227-.00202.025-.00021.044-.00038.057-.00048.006-.00006.011-.0001.014-.00012.003-.00003.004-.00004-.008-1.49999zm-456.9387 44.2833c-9.6257 10.6849-18.7878 28.9538-26.1764 51.5045-7.4012 22.5892-13.06832 49.6162-15.62353 77.9342-5.10417 56.567 2.18312 118.627 33.26553 160.73l2.4135-1.782c-30.4395-41.232-37.769414-102.398-32.69117-158.678 2.53599-28.106 8.15997-54.908 15.48657-77.2701 7.3393-22.4003 16.3418-40.2043 25.5544-50.4307zm-8.5344 290.1687c19.8833 26.933 45.0462 40.393 77.1101 46.309 31.968 5.899 70.864 4.31 118.275 1.173 94.894-6.278 224.533-18.817 403.263 9.198l.464-2.964c-179.105-28.074-309.062-15.503-403.925-9.227-47.467 3.141-85.991 4.69-117.533-1.13-31.4454-5.803-55.8827-18.92-75.2406-45.141zm598.6481 56.68c52.777 8.273 127.254 13.664 195.377 8.082 34.062-2.791 66.59-8.329 94.045-17.652 27.434-9.316 49.95-22.462 63.8-40.568l-2.383-1.823c-13.339 17.439-35.221 30.327-62.382 39.55-27.141 9.216-59.406 14.724-93.325 17.503-67.837 5.559-142.07.189-194.668-8.056zm353.222-50.138c27.475-35.921 41.745-97.849 40.275-156.193-.74-29.204-5.42-57.614-14.43-81.529-9.01-23.9025-22.386-43.44-40.597-54.6953l-1.577 2.5519c17.45 10.7852 30.494 29.6604 39.364 53.2014 8.86 23.527 13.51 51.59 14.24 80.547 1.46 57.979-12.76 119.126-39.658 154.294zm-14.752-292.4173c-54.176-33.4835-127.397-44.48442-209.3-45.99053-81.913-1.5063-172.831 6.49043-262.424 11.20183l.158 2.9959c89.748-4.7197 180.44-12.70193 262.211-11.19824 81.781 1.50388 154.317 12.50184 207.778 45.54294zm-471.724-34.7887c-91.698 4.8223-190.299 1.0037-277.778-.8915-87.366-1.8928-163.8084-1.8783-210.8703 10.7236l.7759 2.8979c46.5591-12.4672 122.5164-12.5182 210.0294-10.6222 87.4 1.8935 186.158 5.7179 278.001.8881z";
