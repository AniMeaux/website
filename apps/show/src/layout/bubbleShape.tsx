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
  "m66.2015 7.59059c.218-.16954.2572-.48368.0877-.70165s-.4837-.25722-.7016-.08768zm-47.9567 276.09841.4645-.185zm955.7632 76.675.171.47zm0-296.6303.244-.4364zm-474.28-62.7337.001-.500027-.005.000044zm-464.2663 333.561-.4023.297zm597.6733 56.089-.077.494zm337.449-339.7973.263-.4253zm-470.856-34.5667.026.4993zm-434.1404-9.48474c-39.5107 30.73274-56.35456 87.70644-60.89283 143.04974-4.539303 55.355 3.21795 109.262 13.08553 134.023l.929-.37c-9.79268-24.573-17.54919-78.314-13.01788-133.572 4.53238-55.2704 21.34348-111.8762 60.51008-142.34141zm908.5914 354.03274c18.128-6.634 30.071-27.022 37.111-54.031 7.05-27.044 9.23-60.891 7.7-94.717-1.53-33.829-6.77-67.671-14.58-94.714-3.9-13.521-8.45-25.356-13.508-34.6447-5.052-9.2767-10.641-16.0699-16.65-19.43l-.488.8728c5.764 3.2231 11.241 9.8191 16.26 19.0354 5.012 9.2043 9.538 20.9655 13.426 34.4435 7.79 26.955 13.01 60.717 14.54 94.482 1.53 33.768-.65 67.506-7.67 94.42-7.02 26.948-18.85 46.891-36.484 53.344zm-956.3987-76.96c15.4756 38.834 39.6878 64.243 71.0167 80.491 31.312 16.239 69.704 23.313 113.527 25.541 43.823 2.229 93.124-.388 146.266-3.558 53.152-3.171 110.155-6.897 169.422-6.897v-1c-59.303 0-116.339 3.729-169.481 6.899-53.151 3.171-102.397 5.783-146.157 3.558-43.76-2.226-81.988-9.286-113.1166-25.43-31.1113-16.136-55.1596-41.359-70.5481-79.974zm500.2317 95.577c44.518 0 87.204 1.791 128.217 3.739 41.008 1.948 80.349 4.054 118.157 4.684 75.616 1.259 145.158-3.387 209.793-27.04l-.343-.939c-64.461 23.589-133.856 28.237-209.433 26.979-37.789-.629-77.109-2.734-118.127-4.683-41.014-1.948-83.721-3.74-128.264-3.74zm456.24-316.1537c-38.723-21.651-107.76-37.2233-191.864-47.4481-84.127-10.22771-183.403-15.1125-282.659-15.349199l-.002.999999c99.229.23663 198.464 5.12026 282.541 15.3419 84.101 10.2245 152.961 25.7823 191.496 47.3282zm-474.524-62.2973c-.004-.499983-.006-.499969-.009-.499943-.003.000027-.008.000068-.014.000122-.013.000108-.032.000271-.058.000491-.05.00044-.126.001108-.227.002021-.201.001826-.501.004632-.898.008549-.792.007835-1.969.020118-3.505.037915-3.072.035595-7.583.093243-13.338.181466-11.508.176445-27.991.475189-47.888.964379-39.793.97838-93.244 2.71859-147.874 5.76598-54.628 3.04722-110.445 7.40212-154.965 13.61112-22.259 3.1043-41.7071 6.6738-56.7762 10.7792-7.5344 2.0526-13.9853 4.2422-19.1502 6.5797-5.1568 2.3339-9.0707 4.8324-11.4933 7.5216l.7429.6693c2.287-2.5386 6.055-4.9682 11.1627-7.2798 5.0996-2.308 11.4956-4.4813 19.0007-6.526 15.0099-4.0892 34.4104-7.6518 56.6514-10.7536 44.479-6.2033 100.264-10.5563 154.882-13.60307 54.617-3.04662 108.057-4.78651 147.844-5.76473 19.893-.48911 36.373-.78779 47.879-.9642 5.753-.0882 10.262-.14583 13.334-.18141 1.535-.01779 2.711-.03007 3.503-.0379.396-.00391.696-.00672.897-.00854.101-.00091.177-.00158.227-.00202.025-.00022.044-.00038.057-.00049.006-.00005.011-.00009.014-.00012.004-.00002.005-.00004.001-.50002zm-456.1957 44.9526c-9.488 10.5321-18.5969 28.646-25.9691 51.1466-7.3763 22.5138-13.02907 49.4648-15.57788 77.7128-5.09552 56.471 2.20597 118.233 33.07408 160.046l.8045-.594c-30.65381-41.523-37.96951-102.987-32.88262-159.362 2.54239-28.177 8.18072-55.054 15.53222-77.4915 7.3557-22.4504 16.4115-40.4094 25.7617-50.7886zm-8.4729 288.9054c19.7081 26.696 44.6292 40.041 76.4866 45.92 31.826 5.873 70.598 4.297 118.028 1.159 94.883-6.278 224.628-18.828 403.484 9.207l.155-.988c-178.981-28.054-308.832-15.494-403.705-9.217-47.449 3.139-86.096 4.702-117.78-1.145-31.6519-5.84-56.3311-19.072-75.8641-45.53zm597.9986 56.286c52.717 8.263 127.113 13.647 195.141 8.073 34.014-2.787 66.454-8.315 93.804-17.602 27.343-9.285 49.648-22.345 63.328-40.229l-.795-.607c-13.509 17.661-35.602 30.635-62.854 39.889-27.246 9.252-59.599 14.769-93.565 17.553-67.933 5.566-142.247.189-194.904-8.065zm352.273-49.758c27.289-35.67 41.539-97.337 40.069-155.559-.74-29.122-5.41-57.416-14.37-81.203-8.96-23.7814-22.226-43.0981-40.183-54.1966l-.526.8506c17.704 10.9418 30.859 30.0378 39.769 53.699 8.92 23.657 13.57 51.835 14.31 80.875 1.46 58.1-12.77 119.508-39.864 154.927zm-14.484-290.9586c-53.937-33.3361-126.93-44.33603-208.792-45.8414-81.866-1.50543-172.709 6.4865-262.353 11.2007l.052.9986c89.697-4.717 180.464-12.70403 262.282-11.19947 81.822 1.50463 154.587 12.50357 208.285 45.69217zm-471.145-34.6407c-91.747 4.8247-190.4 1.0042-277.853-.8905-87.415-1.8938-163.6953-1.8671-210.5897 10.6898l.2587.966c46.7267-12.5121 122.846-12.5509 210.31-10.656 87.426 1.8941 186.132 5.7165 277.926.8893z";
