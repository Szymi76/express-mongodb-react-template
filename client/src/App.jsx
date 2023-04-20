import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { getUserById } from "./app/api/getUserById";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserById("644179e541de4d678f6a65a2"),
  });

  if (isLoading) return "Loading...";
  console.log(data);
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong> <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
