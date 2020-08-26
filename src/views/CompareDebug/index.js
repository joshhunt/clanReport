import React, { useEffect } from "react";

export default function NightfallRedirect() {
  // eslint-disable-next-line no-undef
  useEffect(() => {
    window.location.href = "https://destiny.report/nightfalls";
  }, []);
  return (
    <p>
      Redirecting to <strong>https://destiny.report/nightfalls</strong>
    </p>
  );
}
