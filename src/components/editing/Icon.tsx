// For how vscode-icons-js works see: https://github.com/dderevjanik/vscode-icons-js/issues/5
export function Icon({ name }: { name: string }) {
  return (
    <img
      src={new URL(`../../assets/icons/${name}`, import.meta.url).href}
      width="24"
    />
  );
}
