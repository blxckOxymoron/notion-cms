"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export default function VideoEmbedPasswordStatus() {
  const { pending } = useFormStatus();

  const [wasPending, setWasPending] = useState(false);

  useEffect(() => {
    if (pending) setWasPending(true);
  }, [pending]);

  if (!wasPending || pending) return null;
  return <p className="text-red-500">Das eingegebene Passwort ist nicht korrekt.</p>;
}
