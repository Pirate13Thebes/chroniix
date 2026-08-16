// A 4-digit PIN dedicated to the shared Kiosk terminal, independent of the
// employee's login credential — so changing their password never breaks
// their ability to clock in/out at a shared device.
export function generateKioskPin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}
