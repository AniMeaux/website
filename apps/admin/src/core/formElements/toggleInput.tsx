import { Item, ItemList } from "~/core/dataDisplay/item";
import { Icon } from "~/generated/icon";

export function ToggleInputList({ children }: { children?: React.ReactNode }) {
  return (
    <ItemList asChild>
      <div>{children}</div>
    </ItemList>
  );
}

export function ToggleInput({
  icon,
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <Item asChild>
      <label className="relative cursor-pointer focus-within:z-10">
        <input
          {...rest}
          className="peer appearance-none absolute -z-10 top-0 left-0 w-full h-full rounded-0.5 transition-colors duration-100 ease-in-out group-hover:bg-gray-100 checked:bg-gray-100 focus-visible:outline-none focus-visible:ring-outset focus-visible:ring focus-visible:ring-blue-400"
        />

        <Item.Icon>{icon}</Item.Icon>

        <Item.Content asChild className="peer-checked:text-body-emphasis">
          <span>{label}</span>
        </Item.Content>

        <Item.Icon className="opacity-0 transition-opacity duration-100 ease-in-out peer-checked:opacity-100">
          <Icon id="check" className="text-green-600 text-[14px]" />
        </Item.Icon>
      </label>
    </Item>
  );
}
