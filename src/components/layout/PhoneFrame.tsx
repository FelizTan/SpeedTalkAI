import { ReactNode } from "react";

/**
 * Wraps the entire app in a centered, phone-shaped frame on desktop.
 * Mobile-first: 100% width below md, 430px max above md.
 */
const PhoneFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="phone-stage">
      <div className="phone-frame">{children}</div>
    </div>
  );
};

export default PhoneFrame;
