import AnimatedComponent from "../molecules/AnimatedComponent";
import Logo from "../molecules/Logo";
import Menu from "../molecules/Menu";
import PageTemplate from "@/templates/PageTemplate";
import NavigationTabs from "./NavigationTabs";

export default function Header() {
  return (
    <AnimatedComponent
      HTMLtag="div"
      className="fixed top-0 left-0 w-dvw z-50 bg-[var(--color-background)]/60 backdrop-blur-xl"
      slideUp
    >
      <PageTemplate>
        <div className="flex items-center justify-between h-16 select-none mx-4">
          <Logo />
          <NavigationTabs className="hidden sm:inline" />
          <Menu />
        </div>
      </PageTemplate>
    </AnimatedComponent>
  );
}
