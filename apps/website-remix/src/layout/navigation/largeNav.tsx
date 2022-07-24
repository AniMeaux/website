import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import invariant from "tiny-invariant";
import { cn } from "~/core/classNames";
import {
  handleBlur,
  handleEscape,
  NavGroup,
  NavGroupButton,
  NavLink,
} from "~/layout/navigation/shared";
import { SocialLinks } from "~/layout/navigation/socialLinks";
import { SubNavAct } from "~/layout/navigation/subNavAct";
import { SubNavAdopt } from "~/layout/navigation/subNavAdopt";
import { SubNavDiscover } from "~/layout/navigation/subNavDiscover";
import { SubNavWarn } from "~/layout/navigation/subNavWarn";

export function LargeNav() {
  const location = useLocation();
  const [openedGroup, setOpenedGroup] = useState<NavGroup | null>(null);

  // Force close on navigation change.
  useEffect(() => {
    setOpenedGroup(null);
  }, [location.key]);

  const adoptButtonRef = useRef<HTMLButtonElement>(null);
  const catLinkRef = useRef<HTMLAnchorElement>(null);
  const actButtonRef = useRef<HTMLButtonElement>(null);
  const fosterFamilyLinkRef = useRef<HTMLAnchorElement>(null);
  const warnButtonRef = useRef<HTMLButtonElement>(null);
  const strayCatLinkRef = useRef<HTMLAnchorElement>(null);
  const discoverButtonRef = useRef<HTMLButtonElement>(null);
  const partnersLinkRef = useRef<HTMLAnchorElement>(null);
  const eventLinkRef = useRef<HTMLAnchorElement>(null);

  // Focus first link when a group is opened.
  useEffect(() => {
    if (openedGroup != null) {
      let linkFocusTargetRef =
        openedGroup === "adopt"
          ? catLinkRef
          : openedGroup === "act"
          ? fosterFamilyLinkRef
          : openedGroup === "warn"
          ? strayCatLinkRef
          : openedGroup === "discover"
          ? partnersLinkRef
          : null;

      invariant(
        linkFocusTargetRef?.current != null,
        "linkFocusTargetRef must be set"
      );

      linkFocusTargetRef.current.focus();
    }
  }, [openedGroup]);

  return (
    <>
      <nav className="hidden md:flex lg:gap-2">
        <NavGroupButton
          ref={adoptButtonRef}
          isActive={openedGroup === "adopt"}
          onClick={() => setOpenedGroup("adopt")}
        >
          Adopter
        </NavGroupButton>

        <NavGroupButton
          ref={actButtonRef}
          isActive={openedGroup === "act"}
          onClick={() => setOpenedGroup("act")}
        >
          Agir
        </NavGroupButton>

        <NavGroupButton
          ref={warnButtonRef}
          isActive={openedGroup === "warn"}
          onClick={() => setOpenedGroup("warn")}
        >
          Avertir
        </NavGroupButton>

        <NavGroupButton
          ref={discoverButtonRef}
          isActive={openedGroup === "discover"}
          onClick={() => setOpenedGroup("discover")}
        >
          Découvrir
        </NavGroupButton>

        <NavLink ref={eventLinkRef} to="/evenements">
          Événements
        </NavLink>

        <Dropdown
          isOpened={openedGroup != null}
          prevFocusTargetRef={
            openedGroup === "adopt"
              ? adoptButtonRef
              : openedGroup === "act"
              ? actButtonRef
              : openedGroup === "warn"
              ? warnButtonRef
              : discoverButtonRef
          }
          nextFocusTargetRef={
            openedGroup === "adopt"
              ? actButtonRef
              : openedGroup === "act"
              ? warnButtonRef
              : openedGroup === "warn"
              ? discoverButtonRef
              : eventLinkRef
          }
          onBlur={handleBlur(() => {
            setOpenedGroup((prevOpenedGroup) =>
              prevOpenedGroup === openedGroup ? null : prevOpenedGroup
            );
          })}
        >
          {openedGroup === "adopt" && (
            <SubNavAdopt elementToFocusRef={catLinkRef} />
          )}
          {openedGroup === "act" && (
            <SubNavAct elementToFocusRef={fosterFamilyLinkRef} />
          )}
          {openedGroup === "warn" && (
            <SubNavWarn elementToFocusRef={strayCatLinkRef} />
          )}
          {openedGroup === "discover" && (
            <SubNavDiscover elementToFocusRef={partnersLinkRef} />
          )}
        </Dropdown>
      </nav>

      <div className="hidden md:flex">
        <SocialLinks />
      </div>
    </>
  );
}

function Dropdown({
  isOpened,
  onBlur,
  children,
  prevFocusTargetRef,
  nextFocusTargetRef,
}: Pick<React.HTMLAttributes<HTMLDivElement>, "onBlur"> & {
  isOpened: boolean;
  children?: React.ReactNode;
  prevFocusTargetRef: React.RefObject<HTMLElement>;
  nextFocusTargetRef: React.RefObject<HTMLElement>;
}) {
  const childrenRef = useRef<HTMLDivElement>(null);
  const [childrenHeight, setChildrenHeight] = useState(0);
  useEffect(() => {
    if (childrenRef.current != null) {
      setChildrenHeight(childrenRef.current.clientHeight);
    }
  }, [children]);

  return (
    <Transition mountOnEnter unmountOnExit in={isOpened} timeout={100}>
      {(transitionState) => (
        <div
          className={cn(
            "md:absolute md:-z-10 md:top-0 md:left-0 md:w-full md:bg-white md:shadow-base md:rounded-br-[40px] md:rounded-bl-3xl md:flex md:flex-col md:items-center md:overflow-hidden",
            {
              // Use `ease-in-out` to make sure animation is symetrical between
              // entering and exiting to avoid a weird progress missmatch.
              "transition-[height] duration-100 ease-in-out":
                transitionState === "entering" ||
                transitionState === "exiting" ||
                // Keep it the transition when visible child changes.
                transitionState === "entered",
            }
          )}
          style={{ height: childrenHeight }}
        >
          <div
            ref={childrenRef}
            className={cn(
              "md:w-[600px] md:flex md:flex-col",
              // 104px = 56px (header height) + 48px (padding)
              "md:pt-[104px] md:pb-12"
            )}
            onBlur={onBlur}
            onKeyDown={handleEscape(() => {
              invariant(
                prevFocusTargetRef.current != null,
                "prevFocusTargetRef must be set"
              );
              prevFocusTargetRef.current.focus();
            })}
          >
            <div
              aria-hidden
              tabIndex={0}
              onFocus={() => {
                invariant(
                  prevFocusTargetRef.current != null,
                  "prevFocusTargetRef must be set"
                );
                prevFocusTargetRef.current.focus();
              }}
            />

            {children}

            <div
              aria-hidden
              tabIndex={0}
              onFocus={() => {
                invariant(
                  nextFocusTargetRef.current != null,
                  "nextFocusTargetRef must be set"
                );
                nextFocusTargetRef.current.focus();
              }}
            />
          </div>
        </div>
      )}
    </Transition>
  );
}
