import { isUrduText } from "@/utils";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import { cn } from "@/lib/utils";

const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"] });

export function PoetryText({ children }: { children: any }) {
  const isUrdu = isUrduText(children);

  return (
    <div>
      {isUrdu ? (
        <p className={cn(`${nastaliq.className} leading-loose`)}>{children}</p>
      ) : (
        <p>{children}</p>
      )}
    </div>
  );
}
