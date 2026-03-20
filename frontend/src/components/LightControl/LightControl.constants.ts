export const QUICK_BRIGHTNESS = [
  { label: "Выкл", value: 0 },
  { label: "25%",  value: 25 },
  { label: "50%",  value: 50 },
  { label: "75%",  value: 75 },
  { label: "100%", value: 100 },
]

export const MODES = [
  { id: "AUTO",   label: "AUTO",   sub: "Авто по датчику" },
  { id: "MANUAL", label: "MANUAL", sub: "Ручное управление" },
]

export type ModeType = "AUTO" | "MANUAL"