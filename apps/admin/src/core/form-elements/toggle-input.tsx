import { Item, ItemList } from "#i/core/data-display/item.js"
import { Icon } from "#i/generated/icon.js"

export function ToggleInputList({ children }: { children?: React.ReactNode }) {
  return (
    <ItemList asChild>
      <div>{children}</div>
    </ItemList>
  )
}

export function ToggleInput({
  icon,
  iconChecked,
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode
  iconChecked?: React.ReactNode
  label: React.ReactNode
}) {
  return (
    <Item.Root asChild>
      <label className="relative z-0 cursor-pointer focus-within:z-10">
        <input
          {...rest}
          className="peer absolute top-0 left-0 -z-10 size-full appearance-none rounded-0.5 transition-colors ease-in-out group-hover:bg-gray-100 checked:bg-gray-100 focus-visible:focus-ring"
        />

        <Item.Icon
          className={
            iconChecked == null
              ? "text-gray-600" // For legacy solid icons.
              : "peer-checked:hidden"
          }
        >
          {icon}
        </Item.Icon>

        {iconChecked != null ? (
          <Item.Icon className="hidden peer-checked:flex">
            {iconChecked}
          </Item.Icon>
        ) : null}

        <Item.Content asChild className="peer-checked:text-body-emphasis">
          <span>{label}</span>
        </Item.Content>

        <Item.Icon className="opacity-0 transition-opacity ease-in-out peer-checked:opacity-100">
          <Icon
            href="icon-check-solid"
            className="text-[14px] text-green-600"
          />
        </Item.Icon>
      </label>
    </Item.Root>
  )
}
