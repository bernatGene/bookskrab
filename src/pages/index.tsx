import { trpc } from "../utils/trpc"


export default function Home() {
  const {data, isLoading} = trpc.useQuery(["example.hello", {text: "Bernat"}])
  if (isLoading) return <div>is Loading</div>
  if (data) return <div>{data.greeting}</div>
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center"> 
      <div className="p-8"></div>
      <div className="text-xl text-center">Book title</div>
      <div className="p-2"></div>
      <div className="border rounded p-16 flex max-w-2xl text-center">Book info</div>
    </div>
  );
} 