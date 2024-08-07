import { Item, ItemList } from "#core/data-display/item";
import { Icon } from "#generated/icon";

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
      <label className="relative z-0 cursor-pointer focus-within:z-10">
        <input
          {...rest}
          className="peer absolute left-0 top-0 -z-10 h-full w-full appearance-none rounded-0.5 transition-colors duration-100 ease-in-out checked:bg-gray-100 focus-visible:focus-compact-blue-400 group-hover:bg-gray-100"
        />

        <Item.Icon>{icon}</Item.Icon>

        <Item.Content asChild className="peer-checked:text-body-emphasis">
          <span>{label}</span>
        </Item.Content>

        <Item.Icon className="opacity-0 transition-opacity duration-100 ease-in-out peer-checked:opacity-100">
          <Icon href="icon-check" className="text-[14px] text-green-600" />
        </Item.Icon>
      </label>
    </Item>
  );
}
