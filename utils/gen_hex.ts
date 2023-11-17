export function gen_hex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
