/** Lightweight CSS-only confetti — no external dependency. */
export const fireConfetti = (count = 32): void => {
  if (typeof document === "undefined") return;

  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:9999;";
  document.body.appendChild(container);

  const colors = ["#1E40AF", "#3B82F6", "#F97316", "#FB923C", "#10B981", "#F59E0B"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 8;
    const left = 30 + Math.random() * 40; // %
    const xDrift = (Math.random() - 0.5) * 240;
    const duration = 1200 + Math.random() * 900;
    piece.style.cssText = `
      position:absolute;
      top:50%; left:${left}%;
      width:${size}px; height:${size}px;
      background:${colors[i % colors.length]};
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      transform:translate(-50%,-50%);
      opacity:1;
      transition:transform ${duration}ms cubic-bezier(.2,.7,.2,1), opacity ${duration}ms ease-out;
    `;
    container.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.transform = `translate(calc(-50% + ${xDrift}px), calc(-50% - ${260 + Math.random() * 200}px)) rotate(${Math.random() * 720}deg)`;
      piece.style.opacity = "0";
    });
  }

  setTimeout(() => container.remove(), 2400);
};
