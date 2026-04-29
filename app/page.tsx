import { getUsers } from "./actions/users";
import App from "./components/App";

export default async function Home() {
  const users = await getUsers();

  console.log(users);
  return (
    <div className="bg-white text-black h-fit flex justify-center items-center">
      <App />
    </div>
  );
}
