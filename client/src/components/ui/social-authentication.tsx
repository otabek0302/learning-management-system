import { useSignInWithSocialMutation } from "@/redux/features/auth/authApi";
import { GoogleIcon, GithubIcon } from "@/assets";
import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";

import Image from "next/image";

export const SocialAuthentication = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const hasSubmitted = useRef(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const { data } = useSession();
  const { user } = useSelector((state: RootState) => state.auth);
  const [signInWithSocial, { isSuccess, error }] = useSignInWithSocialMutation();

  useEffect(() => {
    if (!user && data?.user?.email && data?.user?.name && data?.user?.image && !hasSubmitted.current) {
      hasSubmitted.current = true;
      signInWithSocial({
        email: data.user.email,
        name: data.user.name,
        avatar: data.user.image,
      });
    }
  }, [data, user, signInWithSocial]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("messages.success.social_sign_in"));
      router.push("/");
    }
    if (error) {
      toast.error(t("messages.errors.social_sign_in"));
      setIsGoogleLoading(false);
      setIsGithubLoading(false);
    }
  }, [isSuccess, error, t, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google");
    } catch {
      toast.error(t("messages.errors.social_sign_in"));
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsGithubLoading(true);
      await signIn("github");
    } catch {
      toast.error(t("messages.errors.social_sign_in"));
      setIsGithubLoading(false);
    }
  };

  return (
    <>
      <Button type="button" variant="default" size="lg" className="w-full rounded-lg bg-primary p-2 text-base font-medium text-primary-foreground hover:bg-primary/90" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isGithubLoading}>
        <Image src={GoogleIcon} alt="Google" width={20} height={20} className="mr-2" />
        {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-sm font-medium">Google</span>}
      </Button>

      <Button type="button" variant="default" size="lg" className="w-full rounded-lg bg-primary p-2 text-base font-medium text-primary-foreground hover:bg-primary/90" onClick={handleGithubSignIn} disabled={isGoogleLoading || isGithubLoading}>
        <Image src={GithubIcon} alt="Github" width={20} height={20} className="mr-2" />
        {isGithubLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-sm font-medium">Github</span>}
      </Button>
    </>
  );
};
