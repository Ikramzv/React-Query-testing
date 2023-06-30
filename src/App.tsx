import { QueryFunction, useQuery } from "react-query";

interface Post {
  body: string;
  id: number;
  title: string;
  userId: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const getPosts: QueryFunction<Post[]> = async ({ signal }) => {
  const data: Post[] = await fetch(
    "https://jsonplaceholder.typicode.com/posts",
    {
      signal,
    }
  ).then((res) => res.json());
  // SHUFFLE DATa
  const arr: Post[] = [];
  while (data.length > 0) {
    const random = Math.floor(Math.random() * data.length);
    arr.push(data.splice(random, 1)[0]);
  }
  return arr;
};

const getTodos: QueryFunction<Todo[]> = async ({ signal }) => {
  const data: Todo[] = await fetch(
    "https://jsonplaceholder.typicode.com/todos",
    {
      signal,
    }
  ).then((res) => res.json());
  // SHUFFLE DATa
  const arr: Todo[] = [];
  while (data.length > 0) {
    const random = Math.floor(Math.random() * data.length);
    arr.push(data.splice(random, 1)[0]);
  }
  return arr;
};

function App() {
  const postsData = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  const todosData = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  function refetchData(type: "posts" | "todos") {
    if (type === "posts") return postsData.refetch();
    return todosData.refetch();
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-4 flex-1 p-3">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-gray-900 text-lg font-semibold">Posts</h1>
          <button
            className="py-2 px-4 rounded-md text-sm border border-gray-300 active:scale-95 bg-transparent 
          hover:bg-gray-200 duration-200 cursor-pointer outline-none"
            onClick={() => refetchData("posts")}
          >
            Refetch Posts
          </button>
        </div>
        <hr className="bg-gray-500" />
        {postsData.isLoading ? (
          <p className="text-sm font-bold">Loading posts ...</p>
        ) : (
          postsData.data?.map((post) => (
            <div
              key={`post_${post.id}`}
              className="flex flex-col gap-2 border border-gray-400 p-3 rounded-md"
            >
              <p className="text-base font-bold text-gray-900">{post.title}</p>
              <hr className="opacity-70" />
              <p className="text-sm text-gray-700">{post.body}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col gap-4 flex-1 border-r border-gray-200 p-3">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-gray-900 text-lg font-semibold">Todos</h1>
          <button
            className="py-2 px-4 rounded-md text-sm border border-gray-300 active:scale-95 bg-transparent 
          hover:bg-gray-200 duration-200 cursor-pointer outline-none"
            onClick={() => refetchData("todos")}
          >
            Refetch Todos
          </button>
        </div>
        <hr className="bg-gray-500" />
        {todosData.isLoading ? (
          <p className="text-sm font-bold">Loading todos ...</p>
        ) : (
          todosData.data?.map((todo) => (
            <div
              key={`todo_${todo.id}`}
              className="flex flex-col gap-2 border border-gray-400 p-3 rounded-md"
            >
              <p className="text-base font-bold text-gray-900">{todo.title}</p>
              <hr className="opacity-70" />
              <p className="text-sm text-gray-700">
                {todo.completed ? "Completed" : "Incomplete"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
