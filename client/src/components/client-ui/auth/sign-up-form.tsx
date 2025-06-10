import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { SocialAuthentication } from "@/components/ui/social-authentication";
import { Logo } from "@/assets";
import { toast } from "sonner";

import Image from "next/image";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Confirm password is required"),
});

const SignUpForm = ({ setPage }: { setPage: (page: string) => void }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { error, data, status, isLoading, isError, isSuccess }] = useRegisterMutation();

  
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = { name, email, password };
      await register(data).unwrap();
    },
  });
  
  useEffect(() => {
    if (isSuccess) {
      console.log(data?.message);
      toast.success(t("pages.register.messages.check_email", { email: values.email }));
      setPage("verification");
    }
    if (isError) {
      console.log(error);
      if (status === "rejected") {
        toast.error(t("pages.register.messages.already_exist"));
      } else {
        toast.error(t("pages.register.messages.error"));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, status]);
  
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } = formik;

  return (
    <form onSubmit={handleSubmit} className="flex w-[420px] flex-col gap-4">
      <div className="flex flex-col items-start gap-2">
        <div className="relative h-20 w-20">
          <Image src={Logo} alt="Logo" fill className="object-contain" sizes="(max-width: 768px) 80px, 80px" />
        </div>
        <h3 className="text-3xl font-bold">{t("pages.register.form.title")}</h3>
        <p className="text-sm text-gray-400">{t("pages.register.form.description")}</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-gray-500">
            {t("pages.register.form.name")}
          </label>
          <input type="text" name="name" id="name" className={`w-full rounded-lg border border-gray-300 p-2 ${errors.name && touched.name ? "border-red-500" : ""}`} onChange={handleChange} onBlur={handleBlur} value={values.name} />
          <span className="text-xs text-red-500">{errors.name && touched.name && t("pages.register.form.name_error")}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-gray-500">
            {t("pages.register.form.email")}
          </label>
          <input type="text" name="email" id="email" className={`w-full rounded-lg border border-gray-300 p-2 ${errors.email && touched.email ? "border-red-500" : ""}`} onChange={handleChange} onBlur={handleBlur} value={values.email} />
          <span className="text-xs text-red-500">{errors.email && touched.email && t("pages.register.form.email_error")}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm text-gray-500">
            {t("pages.register.form.password")}
          </label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" id="password" className={`w-full rounded-lg border border-gray-300 p-2 ${errors.password && touched.password ? "border-red-500" : ""}`} onChange={handleChange} onBlur={handleBlur} value={values.password} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2">
              {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
            </button>
          </div>
          <span className="text-xs text-red-500">{errors.password && touched.password && t("pages.register.form.password_error")}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-sm text-gray-500">
            {t("pages.register.form.confirm_password")}
          </label>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" className={`w-full rounded-lg border border-gray-300 p-2 ${errors.confirmPassword && touched.confirmPassword ? "border-red-500" : ""}`} onChange={handleChange} onBlur={handleBlur} value={values.confirmPassword} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2">
              {showConfirmPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
            </button>
          </div>
          <span className="text-xs text-red-500">{errors.confirmPassword && touched.confirmPassword && t("pages.register.form.confirm_password_error")}</span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <SocialAuthentication />
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" variant="default" size="lg" className="w-full rounded-lg bg-primary p-2 text-base font-medium text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : ""}
            {t("pages.register.form.sign_up")}
          </Button>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400">{t("pages.register.form.already_have_account")}</span>
            <button type="button" className="font-medium text-primary" onClick={() => setPage("sign-in")}>
              {t("pages.register.form.sign_in")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
