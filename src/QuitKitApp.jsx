import { useState, useEffect } from "react";

/**
 * Kit para dejar de fumar – versión simplificada sin librerías externas
 * Autor: Juanjo TUGores – © 2025.
 */
export default function QuitKitApp() {
  useEffect(() => {
    document.title = "Kit para dejar de fumar";
  }, []);

  const initialItems = [
    { text: "Chicles/comprimidos de nicotina 2 mg", info: "Aportan nicotina controlada para disminuir los síntomas de abstinencia sin humo." },
    { text: "Fidget (cubo, espiral, anillo)",    info: "Sustituye la necesidad de tener algo entre las manos y reduce inquietud." },
    { text: "Botella con boquilla de silicona o pajita", info: "Satisface la acción oral y mantiene hidratación constante." },
    { text: "Difusor + aceite esencial de lavanda",      info: "Crea un aroma neutro ajeno al tabaco y favorece la relajación." },
    { text: "Tarjeta 5‑4‑3‑2‑1 impresa",                  info: "Guía visual rápida para realizar el ejercicio Grounding cuando surge ansiedad." },
    { text: "Temporizador Pomodoro o reloj de cocina",    info: "Estructura el trabajo en intervalos y define pausas sin fumar." },
    { text: "Caja temporizada Kitchen Safe (opcional)",   info: "Añade fricción guardando el tabaco fuera de alcance temporalmente." },
    { text: "Botella de agua saborizada sin azúcar",      info: "Reemplaza las caladas con sorbos y ayuda a controlar antojos." },
    { text: "Auriculares con cancelación de ruido (opcional)", info: "Disminuyen la sobrecarga sensorial y mejoran la concentración." }
  ];

  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quit-checklist") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("quit-checklist", JSON.stringify(items));
  }, [items]);

  const toggleItem = (text) => {
    setItems(prev =>
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
    );
  };

  const senses = [
    { label: "Mira 5 cosas", emoji: "👀" },
    { label: "Toca 4 cosas", emoji: "🤚" },
    { label: "Escucha 3 sonidos", emoji: "👂" },
    { label: "Huele 2 aromas", emoji: "👃" },
    { label: "Saborea 1 cosa", emoji: "👅" }
  ];
  const [step, setStep] = useState(0);
  const nextStep = () => setStep(s => s < senses.length - 1 ? s + 1 : 0);

  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;
  const [secondsLeft, setSecondsLeft] = useState(workDuration);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSecondsLeft(s => {
        if (s > 0) return s - 1;
        setOnBreak(b => !b);
        return b ? workDuration : breakDuration;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, onBreak]);

  const toggleTimer = () => setRunning(r => !r);
  const format = s => {
    const m = String(Math.floor(s/60)).padStart(2,"0");
    const sec = String(s%60).padStart(2,"0");
    return `${m}:${sec}`;
  };

  return (
    <main style={{ maxWidth: 400, margin: "1rem auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Kit para dejar de fumar</h1>

      <section>
        <h2>Checklist de preparación</h2>
        <ul>
          {initialItems.map(({ text, info }) => (
            <li key={text} style={{ margin: "0.5rem 0" }}>
              <label title={info}>
                <input
                  type="checkbox"
                  checked={items.includes(text)}
                  onChange={() => toggleItem(text)}
                />{" "}
                {text}
              </label>
            </li>
          ))}
        </ul>
        {items.length === initialItems.length && <p>¡Kit completo!</p>}
      </section>

      <section>
        <h2>Grounding 5‑4‑3‑2‑1</h2>
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
          {senses[step].emoji}
          <p>{senses[step].label}</p>
          <button onClick={nextStep}>
            {step < senses.length - 1 ? "Siguiente" : "Reiniciar"}
          </button>
        </div>
      </section>

      <section>
        <h2>Pomodoro sin humo</h2>
        <div style={{ fontSize: "2rem", textAlign: "center" }}>{format(secondsLeft)}</div>
        <progress
          value={((onBreak ? breakDuration : workDuration) - secondsLeft)}
          max={onBreak ? breakDuration : workDuration}
          style={{ width: "100%" }}
        />
        <button onClick={toggleTimer} style={{ width: "100%", marginTop: "0.5rem" }}>
          {running ? "Pausar" : onBreak ? "Comenzar descanso" : "Comenzar trabajo"}
        </button>
      </section>

      <footer style={{ fontSize: "0.75rem", marginTop: "1rem", textAlign: "center" }}>
        <p>© 2025 Juanjo TUGores. Todos los derechos reservados.</p>
        <p>Aplicación «tal cual», sin garantías. No sustituye consejo médico.</p>
        <p>Prohibida reproducción sin permiso. Licencias: multimediaconia@gmail.com</p>
      </footer>
    </main>
  );
}
