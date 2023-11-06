import { getNotionPages } from "@/data/notionPages";

export default async function Home() {
  const pages = await getNotionPages();

  return (
    <main className="flex min-h-screen flex-col p-12 gap-12">
      {pages.results.map(({ id, properties, created_time }) => (
        <div key={id}>
          <pre>created: {created_time}</pre>
          {Object.entries(properties).map(([name, property]) => (
            <pre key={property.id}>
              {name}: {JSON.stringify(property[property.type as keyof typeof property])}
            </pre>
          ))}
        </div>
      ))}
    </main>
  );
}

export const revalidate = 3600; // 1 hour
