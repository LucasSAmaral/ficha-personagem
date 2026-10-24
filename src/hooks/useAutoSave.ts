import { useCallback, useEffect, useRef, useState } from "react";

export type AutoSaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

const SAVE_DELAY = 1000;
const RETRY_DELAY = 5000;

// Salva automaticamente a ficha pouco depois de cada mudança feita pelo
// jogador. As gravações não esperam umas pelas outras: com o cache offline do
// Firestore, a promise só resolve quando o servidor confirma, mas a gravação
// já fica guardada no aparelho assim que é feita.
const useAutoSave = <T>(save: (value: T) => Promise<unknown>) => {
  const [status, setStatusState] = useState<AutoSaveStatus>("idle");
  const [online, setOnline] = useState(navigator.onLine);

  const saveRef = useRef(save);
  saveRef.current = save;

  const pending = useRef<T | null>(null);
  const inFlight = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const mounted = useRef(true);

  // A gravação pode terminar depois que a ficha saiu da tela
  const setStatus = useCallback((value: AutoSaveStatus) => {
    if (mounted.current) {
      setStatusState(value);
    }
  }, []);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (pending.current === null) {
      return;
    }

    const value = pending.current;
    pending.current = null;
    inFlight.current += 1;
    setStatus("saving");

    saveRef
      .current(value)
      .then(() => {
        inFlight.current -= 1;
        if (inFlight.current === 0 && pending.current === null) {
          setStatus("saved");
        }
      })
      .catch(() => {
        inFlight.current -= 1;
        if (pending.current === null) {
          pending.current = value;
        }
        setStatus("error");
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(flush, RETRY_DELAY);
      });
  }, [setStatus]);

  const queue = useCallback(
    (value: T) => {
      pending.current = value;
      setStatus("pending");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, SAVE_DELAY);
    },
    [flush, setStatus]
  );

  // Há mudança do jogador que o servidor ainda não confirmou?
  const isDirty = useCallback(
    () => pending.current !== null || inFlight.current > 0,
    []
  );

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        flush();
      }
    };
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      // Saindo da ficha (ex.: voltar para a lista): grava o que faltou
      mounted.current = false;
      flush();
    };
  }, [flush]);

  return { status, online, queue, isDirty };
};

export default useAutoSave;
