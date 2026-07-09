"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Loader2, ArrowLeft } from "lucide-react";

/* Patch 1.2 — вместо обычной формы: короткий квиз в 5 шагов */

const EVENT_TYPES = ["Свадьба", "Юбилей", "Корпоратив", "Выпускной", "День рождения"];
const GUESTS = ["До 30 гостей", "30–70 гостей", "70–150 гостей", "150+ гостей"];
const CONTACT = ["WhatsApp", "Telegram", "Телефон"];

type Status = "idle" | "sending" | "done" | "error";

export default function LeadModal({
  isOpen,
  onClose,
  preset,
}: {
  isOpen: boolean;
  onClose: () => void;
  preset?: string;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // направление анимации шагов
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    type: "",
    guests: "",
    date: "",
    contact: "",
    name: "",
    phone: "",
  });

  const TOTAL = 5;

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      // если пришли с карточки формата — тип уже выбран, начинаем со 2-го шага
      if (preset && EVENT_TYPES.includes(preset)) {
        setForm((f) => ({ ...f, type: preset }));
        setStep(1);
      } else {
        setStep(0);
      }
      setDir(1);
    } else {
      document.documentElement.style.overflow = "";
      const t = setTimeout(() => {
        setStatus("idle");
        setErrorMsg("");
        setStep(0);
        setForm({ type: "", guests: "", date: "", contact: "", name: "", phone: "" });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, preset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const next = () => {
    setDir(1);
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const pick = (key: "type" | "guests" | "contact") => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setTimeout(next, 220); // короткая пауза, чтобы выбор успел «подсветиться»
  };

  async function submit() {
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, "").length < 7) {
      setErrorMsg("Впишите имя и телефон, чтобы я могла с вами связаться.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setErrorMsg(
          json.error === "not_configured"
            ? "Форма ещё не подключена к Telegram. Напишите мне напрямую — контакты ниже."
            : json.error === "Проверьте имя и телефон"
            ? json.error
            : "Не удалось отправить. Попробуйте ещё раз или напишите в мессенджер."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Нет связи с сервером. Проверьте интернет и попробуйте снова.");
    }
  }

  const field =
    "w-full bg-transparent border-b border-[var(--color-line)] py-3 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none transition-colors";

  const stepTitle = useMemo(
    () =>
      [
        "Какое мероприятие планируется?",
        "Планируемое количество гостей",
        "Дата мероприятия",
        "Как удобнее связаться?",
        "Куда прислать ответ?",
      ][step],
    [step]
  );

  const slide = {
    initial: (d: number) => ({ x: d * 46, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -46, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute inset-0 bg-espresso/45 backdrop-blur-[3px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full sm:max-w-[520px] bg-paper rounded-t-[28px] sm:rounded-[16px] p-6 sm:p-10 soft-shadow max-h-[92vh] overflow-y-auto no-scrollbar"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
          >
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute top-5 right-5 w-10 h-10 rounded-full grid place-items-center text-muted hover:text-ink hover:bg-bg-2 transition-colors"
            >
              <X size={20} />
            </button>

            {status === "done" ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-accent grid place-items-center text-espresso">
                  <Check size={30} />
                </div>
                <h3 className="display text-[2rem] mb-3">Заявка у меня</h3>
                <p className="text-ink-soft leading-relaxed max-w-[340px] mx-auto">
                  Спасибо! Свяжусь с вами в течение дня — обсудим дату и детали
                  вашего события.
                </p>
                <button className="btn btn-ghost mt-7" onClick={onClose}>
                  Хорошо
                </button>
              </div>
            ) : (
              <>
                {/* Шапка квиза: назад + прогресс */}
                <div className="flex items-center gap-4 mb-6 pr-10">
                  {step > 0 ? (
                    <button
                      onClick={back}
                      aria-label="Назад"
                      className="w-9 h-9 -ml-1 rounded-full grid place-items-center text-muted hover:text-ink hover:bg-bg-2 transition-colors shrink-0"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  ) : (
                    <span className="eyebrow shrink-0">Заявка на дату</span>
                  )}
                  <div className="flex-1 h-[3px] rounded-full bg-bg-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
                      transition={{ type: "spring", damping: 24, stiffness: 200 }}
                    />
                  </div>
                  <span className="text-muted text-xs font-semibold shrink-0 tabular-nums">
                    {step + 1}/{TOTAL}
                  </span>
                </div>

                <div className="relative min-h-[300px] sm:min-h-[320px] overflow-hidden">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={slide}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <h3 className="display text-[1.5rem] sm:text-[1.7rem] leading-[1.08] mb-6">
                        {stepTitle}
                      </h3>

                      {step === 0 && (
                        <div className="space-y-3">
                          {EVENT_TYPES.map((t) => (
                            <button
                              key={t}
                              className="quiz-opt"
                              data-active={form.type === t}
                              onClick={() => pick("type")(t)}
                            >
                              <span className="quiz-dot" />
                              {t}
                            </button>
                          ))}
                        </div>
                      )}

                      {step === 1 && (
                        <div className="space-y-3">
                          {GUESTS.map((g) => (
                            <button
                              key={g}
                              className="quiz-opt"
                              data-active={form.guests === g}
                              onClick={() => pick("guests")(g)}
                            >
                              <span className="quiz-dot" />
                              {g}
                            </button>
                          ))}
                        </div>
                      )}

                      {step === 2 && (
                        <div>
                          <input
                            type="date"
                            className={`${field} text-lg`}
                            value={form.date}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, date: e.target.value }))
                            }
                          />
                          <p className="text-muted text-sm mt-4 leading-relaxed">
                            Если дата ещё не определена — просто нажмите «Дальше»,
                            обсудим варианты при разговоре.
                          </p>
                          <button className="btn btn-primary w-full justify-center mt-8" onClick={next}>
                            Дальше
                          </button>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-3">
                          {CONTACT.map((c) => (
                            <button
                              key={c}
                              className="quiz-opt"
                              data-active={form.contact === c}
                              onClick={() => pick("contact")(c)}
                            >
                              <span className="quiz-dot" />
                              {c}
                            </button>
                          ))}
                        </div>
                      )}

                      {step === 4 && (
                        <div>
                          <div className="space-y-5">
                            <input
                              className={field}
                              placeholder="Ваше имя"
                              value={form.name}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, name: e.target.value }))
                              }
                              autoComplete="name"
                            />
                            <input
                              className={field}
                              placeholder="Телефон"
                              value={form.phone}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, phone: e.target.value }))
                              }
                              inputMode="tel"
                              autoComplete="tel"
                            />
                          </div>

                          {status === "error" && (
                            <p className="text-[#b23b3b] text-sm mt-4">{errorMsg}</p>
                          )}

                          <button
                            className="btn btn-primary w-full justify-center mt-7"
                            onClick={submit}
                            disabled={status === "sending"}
                          >
                            {status === "sending" ? (
                              <>
                                <Loader2 size={18} className="animate-spin" /> Отправляю…
                              </>
                            ) : (
                              "Отправить заявку"
                            )}
                          </button>
                          <p className="text-muted/70 text-xs text-center mt-4">
                            Нажимая кнопку, вы соглашаетесь на обработку
                            персональных данных.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
