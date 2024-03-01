export default async function Layout(props: {
  overlay: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {props.children}
      {props.overlay}
    </>
  );
}
