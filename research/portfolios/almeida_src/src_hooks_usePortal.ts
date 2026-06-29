import { useEffect, useState } from "react";

export default function usePortal(id = "custom-portal") {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(id);
    let created = false;

    if (!element) {
      element = document.createElement("div");
      element.setAttribute("id", id);
      document.body.appendChild(element);
      created = true;
    }

    setPortalElement(element);

    return () => {
      if (created && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [id]);

  return portalElement;
}
