export function Icon({ name }: { name: string }) {
  return (
    <img
      src={new URL(`../../assets/icons/${name}`, import.meta.url).href}
      width="24"
    />
  );
}
