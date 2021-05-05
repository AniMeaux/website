import * as React from "react";
import { Link, LinkProps } from "~/core/link";
import { ChildrenProp } from "~/core/types";

export function TagList(props: ChildrenProp) {
  return <ul {...props} className="TagList" />;
}

export function TagListItem(props: ChildrenProp) {
  return <li {...props} className="TagListItem" />;
}

export function TagLink(props: LinkProps) {
  return <Link {...props} className="TagLink" />;
}

export function TagIcon(props: ChildrenProp) {
  return <span {...props} className="TagIcon" />;
}

export function TagContent(props: ChildrenProp) {
  return <span {...props} />;
}
