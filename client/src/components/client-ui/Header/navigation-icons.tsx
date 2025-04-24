import { DarkMode, LanguagesDropdown, NavNotification, NavUser } from "@/components/ui";

const NavigationIcons = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="block">
        <LanguagesDropdown />
      </div>
      <div className="block">
        <DarkMode />
      </div>
      <div className="hidden md:block">
        <NavNotification />
      </div>
      <div className="hidden md:block">
        <NavUser />
      </div>
    </div>
  );
};

export default NavigationIcons;
