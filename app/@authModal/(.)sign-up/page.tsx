import Signup from "@/components/Signup";
import CloseModalBtn from "@/components/CloseModalBtn";

export default function SignUpModal() {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10">
      <div className="flex container items-center h-full">
        <div className="relative bg-white w-full max-w-lg mx-auto h-fit px-2 py-20 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModalBtn />
          </div>

          <Signup />
        </div>
      </div>
    </div>
  );
}
