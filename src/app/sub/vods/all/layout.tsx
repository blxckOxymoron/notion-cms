export default async function Layout(props: {
  overlay: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {props.overlay}
      {props.children}
    </>
  );
}
