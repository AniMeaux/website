import { cn } from "#core/classNames.ts";

type Direction =
  | "left-to-right"
  | "right-to-left"
  | "top-to-bottom-right"
  | "top-to-bottom-left";

export function BeeIllustration({
  direction,
  className,
}: {
  direction: Direction;
  className?: string;
}) {
  return (
    <svg
      fill="none"
      viewBox={
        direction === "top-to-bottom-right" ||
        direction === "top-to-bottom-left"
          ? "0 0 53 100"
          : "0 0 100 53"
      }
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-visible", className)}
    >
      {DIRECTION_PATHS[direction]}
    </svg>
  );
}

const DIRECTION_PATHS: Record<Direction, React.ReactNode> = {
  "left-to-right": (
    <>
      <g className="fill-alabaster">
        <path d="m10.0801 24.7985c.862 1.8803 4.5993 5.1665 10.1244 8.4157l.0808-15.6615c-.0848.0404-.1713.0774-.2578.1143-.0865.037-.1731.0739-.258.1144-6.9153 3.2984-9.2522 6.1142-9.6894 7.0171z" />
        <path d="m60.1855 42.2485c7.4693-.6809 14.3202-2.4036 19.807-5.0207 6.2506-2.9814 9.9954-6.8854 10.0126-10.4523.0324-6.629-12.27-14.0059-29.7985-15.8175z" />
        <path d="m26.9647 14.8885c3.3148-1.1297 6.8149-2.0528 10.353-2.7508l-.1544 28.2816c-3.6812-1.0215-7.1471-2.3194-10.3093-3.7448z" />
        <path d="m52.4772 10.5478c-2.7329-.0157-5.5814.1625-8.475.5012l-.1521 30.7976c2.7601.4367 5.586.7205 8.4589.7389.2885.0104.5773.0031.8686-.0043.1189-.003.2382-.0061.3581-.0079l.0199-31.9845c-.357-.0208-.7141-.0412-1.0784-.041z" />
      </g>

      <path
        d="m.107251 26.1829c-.943737-6.1636 4.354669-12.1972 15.343149-17.43819 4.6811-2.2327 9.9289-4.0412 15.3509-5.4121-1.285-11.1737.6495-19.85571 5.3555-21.16291 5.1638-1.4387 12.0475 6.4051 16.8285 18.393712.4063.0146.8124.029098 1.2187.043699 4.6304-11.946711 11.3572-19.789711 16.518-18.432511 4.8262 1.2741 6.8529 10.25401 5.5453 21.77901 14.4458 4.4453 23.7857 12.85349 23.7325 22.89499-.0382 7.7081-5.6191 14.6054-15.7167 19.4215-8.7116 4.155-20.1001 6.4101-32.0621 6.335-23.8612-.1283-50.43879-15.4865-52.113749-26.4222zm89.892749.5919c.0321-6.629-12.2706-14.0059-29.8-15.8175l-.0211 31.2906c7.4696-.6811 14.3209-2.4037 19.808-5.0208 6.251-2.9816 9.9958-6.8856 10.0131-10.4523zm-36.4852 15.8047.0199-31.9845c-.3644.0002-.714-.0412-1.0785-.041-2.7331-.0158-5.5817.1624-8.4755.5013l-.1661 30.8042c2.7669.4509 5.5929.7346 8.4593.739.4137-.0064.8205-.0269 1.2409-.019zm-16.3662-2.1755.1543-28.2816c-3.5314.7122-7.0386 1.6211-10.3535 2.7508l-.1175 21.7719c3.1692 1.4395 6.6418 2.7515 10.3167 3.7589zm-27.0777-15.6058c.8553 1.866 4.5995 5.1665 10.1249 8.4157l.0809-15.6614c-.1696.0809-.3461.1478-.5159.2287-6.9156 3.2985-9.2527 6.1141-9.6899 7.017z"
        className="fill-prussianBlue"
      />
    </>
  ),

  "right-to-left": (
    <>
      <g className="fill-alabaster">
        <path d="m89.9255 24.7956c-.8621 1.8803-4.5994 5.1665-10.1245 8.4157l-.0808-15.6615c.0848.0404.1713.0774.2578.1143.0866.037.1732.0739.258.1144 6.9153 3.2985 9.2522 6.1142 9.6895 7.0171z" />
        <path d="m39.8196 42.2506c-7.4693-.6809-14.3201-2.4037-19.807-5.0208-6.2505-2.9814-9.9952-6.8854-10.0125-10.4523-.03234-6.629 12.2699-14.0059 29.7984-15.8175z" />
        <path d="m73.0409 14.8904c-3.3148-1.1297-6.8149-2.0528-10.3529-2.7508l.1543 28.2816c3.6813-1.0215 7.1471-2.3194 10.3094-3.7448z" />
        <path d="m47.5282 10.5508c2.7328-.0157 5.5814.1625 8.475.5012l.1521 30.7976c-2.7601.4367-5.586.7205-8.459.739-.2884.0103-.5772.003-.8685-.0044-.1189-.003-.2383-.0061-.3581-.0079l-.02-31.9845c.3571-.0208.7141-.0412 1.0785-.041z" />
      </g>

      <path
        d="m99.8927 26.183c.9433-6.1637-4.3546-12.1973-15.3431-17.4383-4.6811-2.2327-9.9289-4.0411-15.3509-5.4121 1.285-11.1737-.6495-19.8557-5.3555-21.1629-5.1638-1.4387-12.0475 6.4051-16.8285 18.393702-.4063.014601-.8124.029099-1.2187.043699-4.6304-11.946701-11.3572-19.789701-16.518-18.432501-4.8262 1.2741-6.8529 10.254-5.5453 21.7791-14.44582 4.4452-23.7857887 12.8534-23.73247294 22.895.03815234 7.7081 5.61910294 14.6053 15.71667294 19.4214 8.7116 4.155 20.1001 6.4101 32.0621 6.335 23.8612-.1283 50.4388-15.4865 52.1137-26.4221zm-89.8927.5918c-.03211-6.6289 12.2706-14.0059 29.8-15.8175l.0211 31.2906c-7.4696-.6811-14.3209-2.4037-19.808-5.0208-6.251-2.9816-9.9958-6.8856-10.0131-10.4523zm36.4852 15.8047-.0199-31.9845c.3644.0002.714-.0412 1.0785-.0409 2.7331-.0159 5.5817.1623 8.4755.5012l.1661 30.8042c-2.7669.4509-5.5929.7346-8.4593.739-.4137-.0064-.8205-.0269-1.2409-.019zm16.3662-2.1755-.1543-28.2816c3.5314.7122 7.0386 1.6211 10.3535 2.7508l.1175 21.7719c-3.1692 1.4395-6.6418 2.7515-10.3167 3.7589zm27.0777-15.6058c-.8553 1.8661-4.5995 5.1665-10.1249 8.4157l-.0809-15.6614c.1696.0809.3461.1478.5159.2287 6.9156 3.2985 9.2527 6.1141 9.6899 7.017z"
        className="fill-prussianBlue"
      />
    </>
  ),

  "top-to-bottom-right": (
    <g transform="rotate(90) translate(0 -53)">
      <g className="fill-alabaster">
        <path d="m10.0801 24.7985c.862 1.8803 4.5993 5.1665 10.1244 8.4157l.0808-15.6615c-.0848.0404-.1713.0774-.2578.1143-.0865.037-.1731.0739-.258.1144-6.9153 3.2984-9.2522 6.1142-9.6894 7.0171z" />
        <path d="m60.1855 42.2485c7.4693-.6809 14.3202-2.4036 19.807-5.0207 6.2506-2.9814 9.9954-6.8854 10.0126-10.4523.0324-6.629-12.27-14.0059-29.7985-15.8175z" />
        <path d="m26.9647 14.8885c3.3148-1.1297 6.8149-2.0528 10.353-2.7508l-.1544 28.2816c-3.6812-1.0215-7.1471-2.3194-10.3093-3.7448z" />
        <path d="m52.4772 10.5478c-2.7329-.0157-5.5814.1625-8.475.5012l-.1521 30.7976c2.7601.4367 5.586.7205 8.4589.7389.2885.0104.5773.0031.8686-.0043.1189-.003.2382-.0061.3581-.0079l.0199-31.9845c-.357-.0208-.7141-.0412-1.0784-.041z" />
      </g>

      <path
        d="m.107251 26.1829c-.943737-6.1636 4.354669-12.1972 15.343149-17.43819 4.6811-2.2327 9.9289-4.0412 15.3509-5.4121-1.285-11.1737.6495-19.85571 5.3555-21.16291 5.1638-1.4387 12.0475 6.4051 16.8285 18.393712.4063.0146.8124.029098 1.2187.043699 4.6304-11.946711 11.3572-19.789711 16.518-18.432511 4.8262 1.2741 6.8529 10.25401 5.5453 21.77901 14.4458 4.4453 23.7857 12.85349 23.7325 22.89499-.0382 7.7081-5.6191 14.6054-15.7167 19.4215-8.7116 4.155-20.1001 6.4101-32.0621 6.335-23.8612-.1283-50.43879-15.4865-52.113749-26.4222zm89.892749.5919c.0321-6.629-12.2706-14.0059-29.8-15.8175l-.0211 31.2906c7.4696-.6811 14.3209-2.4037 19.808-5.0208 6.251-2.9816 9.9958-6.8856 10.0131-10.4523zm-36.4852 15.8047.0199-31.9845c-.3644.0002-.714-.0412-1.0785-.041-2.7331-.0158-5.5817.1624-8.4755.5013l-.1661 30.8042c2.7669.4509 5.5929.7346 8.4593.739.4137-.0064.8205-.0269 1.2409-.019zm-16.3662-2.1755.1543-28.2816c-3.5314.7122-7.0386 1.6211-10.3535 2.7508l-.1175 21.7719c3.1692 1.4395 6.6418 2.7515 10.3167 3.7589zm-27.0777-15.6058c.8553 1.866 4.5995 5.1665 10.1249 8.4157l.0809-15.6614c-.1696.0809-.3461.1478-.5159.2287-6.9156 3.2985-9.2527 6.1141-9.6899 7.017z"
        className="fill-prussianBlue"
      />
    </g>
  ),

  "top-to-bottom-left": (
    <g transform="rotate(-90) translate(-100)">
      <g className="fill-alabaster">
        <path d="m89.9255 24.7956c-.8621 1.8803-4.5994 5.1665-10.1245 8.4157l-.0808-15.6615c.0848.0404.1713.0774.2578.1143.0866.037.1732.0739.258.1144 6.9153 3.2985 9.2522 6.1142 9.6895 7.0171z" />
        <path d="m39.8196 42.2506c-7.4693-.6809-14.3201-2.4037-19.807-5.0208-6.2505-2.9814-9.9952-6.8854-10.0125-10.4523-.03234-6.629 12.2699-14.0059 29.7984-15.8175z" />
        <path d="m73.0409 14.8904c-3.3148-1.1297-6.8149-2.0528-10.3529-2.7508l.1543 28.2816c3.6813-1.0215 7.1471-2.3194 10.3094-3.7448z" />
        <path d="m47.5282 10.5508c2.7328-.0157 5.5814.1625 8.475.5012l.1521 30.7976c-2.7601.4367-5.586.7205-8.459.739-.2884.0103-.5772.003-.8685-.0044-.1189-.003-.2383-.0061-.3581-.0079l-.02-31.9845c.3571-.0208.7141-.0412 1.0785-.041z" />
      </g>

      <path
        d="m99.8927 26.183c.9433-6.1637-4.3546-12.1973-15.3431-17.4383-4.6811-2.2327-9.9289-4.0411-15.3509-5.4121 1.285-11.1737-.6495-19.8557-5.3555-21.1629-5.1638-1.4387-12.0475 6.4051-16.8285 18.393702-.4063.014601-.8124.029099-1.2187.043699-4.6304-11.946701-11.3572-19.789701-16.518-18.432501-4.8262 1.2741-6.8529 10.254-5.5453 21.7791-14.44582 4.4452-23.7857887 12.8534-23.73247294 22.895.03815234 7.7081 5.61910294 14.6053 15.71667294 19.4214 8.7116 4.155 20.1001 6.4101 32.0621 6.335 23.8612-.1283 50.4388-15.4865 52.1137-26.4221zm-89.8927.5918c-.03211-6.6289 12.2706-14.0059 29.8-15.8175l.0211 31.2906c-7.4696-.6811-14.3209-2.4037-19.808-5.0208-6.251-2.9816-9.9958-6.8856-10.0131-10.4523zm36.4852 15.8047-.0199-31.9845c.3644.0002.714-.0412 1.0785-.0409 2.7331-.0159 5.5817.1623 8.4755.5012l.1661 30.8042c-2.7669.4509-5.5929.7346-8.4593.739-.4137-.0064-.8205-.0269-1.2409-.019zm16.3662-2.1755-.1543-28.2816c3.5314.7122 7.0386 1.6211 10.3535 2.7508l.1175 21.7719c-3.1692 1.4395-6.6418 2.7515-10.3167 3.7589zm27.0777-15.6058c-.8553 1.8661-4.5995 5.1665-10.1249 8.4157l-.0809-15.6614c.1696.0809.3461.1478.5159.2287 6.9156 3.2985 9.2527 6.1141 9.6899 7.017z"
        className="fill-prussianBlue"
      />
    </g>
  ),
};
