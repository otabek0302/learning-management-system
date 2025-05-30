import * as Yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Logo } from "@/assets";
import Image from "next/image";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const schema = Yup.object().shape({
  code: Yup.string()
    .required("Verification code is required")
    .matches(/^[0-9]{6}$/, "Verification code must be 6 digits"),
});

const Verification = ({ setPage }: { setPage: (page: string) => void }) => {
  const { t } = useTranslation();
  const [isResending, setIsResending] = useState(false);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: schema,
    onSubmit: async ({ code }) => {
      console.log("Verifying code:", code);
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
          <Image src={Logo} alt="Logo" fill priority className="object-contain" sizes="80px" />
        </div>
        <h3 className="text-3xl font-bold">{t("pages.verification.form.title")}</h3>
        <p className="text-sm text-gray-400">{t("pages.verification.form.description")}</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="text-sm text-gray-500">
            {t("pages.verification.form.code")}
          </label>
          <InputOTP maxLength={6} value={values.code} onChange={(value: string) => formik.setFieldValue("code", value)} onBlur={handleBlur} className={`${errors.code && touched.code ? "border-red-500" : ""} w-full`}>
            <InputOTPGroup className="w-full">
              <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>
          <span className="text-xs text-red-500">{errors.code && touched.code && t("pages.verification.form.code_error")}</span>
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" variant="default" size="lg" className="w-full rounded-lg bg-primary p-2 text-base font-medium text-primary-foreground hover:bg-primary/90">
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
