export default function genCaptcha() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
    ''
  );
}
