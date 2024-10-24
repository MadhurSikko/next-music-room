import { auth } from "@/auth";
import SignOut  from "@/components/sign-out";
import SignIn from "@/components/sign-in";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    return (
      <div>
        <SignOut />
        {session?.accessToken}
      </div>
    )
  }
  
  return (
    <div>
      <SignIn />
    </div>
  );
}
