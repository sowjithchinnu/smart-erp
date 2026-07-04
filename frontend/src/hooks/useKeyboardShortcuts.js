"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isCtrlPressed = event.ctrlKey || event.metaKey;
      const isShiftPressed = event.shiftKey;

      if (event.key === "F5") {
        event.preventDefault();
        router.refresh();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        const modalOpen = !!document.querySelector(
          '[role="dialog"], [data-modal="true"], .modal'
        );

        if (modalOpen) {
          window.dispatchEvent(new CustomEvent("closeModal"));
        } else {
          router.back();
        }
        return;
      }

      if (isCtrlPressed && event.key.toLowerCase() === "h") {
        event.preventDefault();
        router.push("/dashboard");
        return;
      }

      if (isCtrlPressed && event.key.toLowerCase() === "q") {
        event.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        const cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
          const [name] = cookie.split("=");
          const trimmedName = name.trim();
          if (/token|auth|jwt/i.test(trimmedName)) {
            document.cookie = `${trimmedName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
          }
        });

        router.push("/login");
        return;
      }

      if (isCtrlPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("openCommandPalette"));
        return;
      }

      if (isCtrlPressed && event.key.toLowerCase() === "f") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("focusSearch"));
        return;
      }

      if (isCtrlPressed && event.key.toLowerCase() === "n") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("newItem"));
        return;
      }

      if (isCtrlPressed && event.key.toLowerCase() === "b") {
        event.preventDefault();
        router.push("/dashboard");
        return;
      }

      if (isCtrlPressed && event.key.toLowerCase() === "p") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("printInvoice"));
        return;
      }

      if (isCtrlPressed && isShiftPressed && event.key.toLowerCase() === "p") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("downloadPDF"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);
}
