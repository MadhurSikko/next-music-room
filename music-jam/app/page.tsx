import { auth } from "@/auth";
import SignOut  from "@/components/sign-out";
import SignIn from "@/components/sign-in";
import { getAvailableDevices, getCurrentlyPlayingTrack, startOrResumePlayback } from "@/app/actions/actions";

export default async function Home() {
  const session = await auth();
  const devices = await getAvailableDevices(session?.accessToken);
  const currentlyPlaying = await getCurrentlyPlayingTrack(session?.accessToken);
  if (session?.user) {
    return (
      <div>
        <SignOut />
        <p>{devices}</p>
        <br />
        <br />
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
