import * as Yup from "yup";
import { useEffect, useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Logo } from "@/assets";
import { Loader2 } from "lucide-react";

import Image from "next/image";

const schema = Yup.object().shape({
  code: Yup.string()
    .required("Verification code is required")
    .matches(/^[0-9]{4}$/, "Verification code must be 4 digits"),
});

const Verification = ({ setPage }: { setPage: (page: string) => void }) => {
  const { t } = useTranslation();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isResending, setIsResending] = useState(false);
  const [activation, { error, data, isLoading, isError, isSuccess }] = useActivationMutation();

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      toast.success(t("pages.verification.messages.success"));
      setPage("sign-in");
    }
    if (isError) {
      console.log(error);
      toast.error(t("pages.verification.messages.error"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: schema,
    onSubmit: async ({ code }) => {
      console.log("Verifying code:", code);
      await activation({ activation_token: token as unknown as string, activation_code: code }).unwrap();
    },
  });

  const { handleSubmit, handleBlur, values, errors, touched } = formik;

  const handleResendCode = async () => {
    setIsResending(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-[420px] flex-col gap-4">
      <div className="flex flex-col items-start gap-2">
        <div className="relative h-20 w-20">
          <Image src={Logo} alt="Logo" fill className="object-contain" sizes="(max-width: 768px) 80px, 80px" />
        </div>
        <h3 className="text-3xl font-bold">{t("pages.verification.form.title")}</h3>
        <p className="text-sm text-gray-400">{t("pages.verification.form.description")}</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="text-sm text-gray-500">
            {t("pages.verification.form.code")}
          </label>
          <InputOTP maxLength={4} value={values.code} onChange={(value: string) => formik.setFieldValue("code", value)} onBlur={handleBlur} className={`${errors.code && touched.code ? "border-red-500" : ""} w-full`}>
            <InputOTPGroup className="w-full gap-2">
              <InputOTPSlot index={0} className="h-12 w-12 rounded-[12px!important] border border-gray-300 text-lg" />
              <InputOTPSlot index={1} className="h-12 w-12 rounded-[12px!important] border border-gray-300 text-lg" />
              <InputOTPSlot index={2} className="h-12 w-12 rounded-[12px!important] border border-gray-300 text-lg" />
              <InputOTPSlot index={3} className="h-12 w-12 rounded-[12px!important] border border-gray-300 text-lg" />
            </InputOTPGroup>
          </InputOTP>
          <span className="text-xs text-red-500">{errors.code && touched.code && t("pages.verification.form.code_error")}</span>
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={isLoading} variant="default" size="lg" className="w-full rounded-lg bg-primary p-2 text-base font-medium text-primary-foreground hover:bg-primary/90">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : ""}
            {t("pages.verification.form.verify")}
          </Button>

          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400">{t("pages.verification.form.didnt_receive")}</span>
            <button type="button" className="font-medium text-primary" onClick={handleResendCode} disabled={isResending}>
              {isResending ? t("pages.verification.form.resending") : t("pages.verification.form.resend_code")}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button type="button" className="font-medium text-primary" onClick={() => setPage("sign-in")}>
              {t("pages.verification.form.back_to")}
            </button>
            <span className="text-gray-400">|</span>
            <button type="button" className="font-medium text-primary" onClick={() => setPage("sign-in")}>
              {t("pages.verification.form.sign_in")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Verification;
