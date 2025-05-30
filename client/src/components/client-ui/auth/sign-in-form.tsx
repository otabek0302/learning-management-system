import * as Yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Logo, GoogleIcon, GithubIcon } from "@/assets";

import Image from "next/image";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignInForm = ({ setPage }: { setPage: (page: string) => void }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      console.log(email, password);
      setPage("verification");
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } = formik;

  return (
    <form onSubmit={handleSubmit} className="flex w-[420px] flex-col gap-4">
      <div className="flex flex-col items-start gap-2">
        <div className="relative h-20 w-20">
          <Image src={Logo} alt="Logo" fill priority className="object-contain" sizes="80px" />
        </div>
        <h3 className="text-3xl font-bold">{t("pages.login.form.title")}</h3>
        <p className="text-sm text-gray-400">{t("pages.login.form.description")}</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-gray-500">
            {t("pages.login.form.email")}
          </label>
          <input type="text" name="email" id="email" className={`w-full rounded-lg border border-gray-300 p-2 ${errors.email && touched.email ? "border-red-500" : ""}`} onChange={handleChange} onBlur={handleBlur} value={values.email} />
          <span className="text-xs text-red-500">{errors.email && touched.email && t("pages.login.form.email_error")}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm text-gray-500">
            {t("pages.login.form.password")}
          </label>
          <div className="relative">
            <input type={show ? "text" : "password"} name="password" id="password" className={`w-full rounded-lg border border-gray-300 p-2 ${errors.password && touched.password ? "border-red-500" : ""}`} onChange={handleChange} onBlur={handleBlur} value={values.password} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-6 top-1/2 -translate-y-1/2">
              {show ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
            </button>
          </div>
          <span className="text-xs text-red-500">{errors.password && touched.password && t("pages.login.form.password_error")}</span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <Button variant="default" size="lg" className="w-full rounded-lg bg-primary p-2 text-base font-medium text-primary-foreground hover:bg-primary/90">
            <Image src={GoogleIcon} alt="Google" width={20} height={20} className="mr-2" sizes="20px" />
            <span className="text-sm font-medium">Google</span>
          </Button>
          <Button variant="default" size="lg" className="w-full rounded-lg bg-primary p-2 text-base font-medium text-primary-foreground hover:bg-primary/90">
            <Image src={GithubIcon} alt="Github" width={20} height={20} className="mr-2" sizes="20px" />
            <span className="text-sm font-medium">Github</span>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" variant="default" size="lg" className="w-full rounded-lg bg-primary p-2 text-base font-medium text-primary-foreground hover:bg-primary/90">
            {t("pages.login.form.sign_in")}
          </Button>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400">{t("pages.login.form.dont_have_account")}</span>
            <button type="button" className="font-medium text-primary" onClick={() => setPage("sign-up")}>
              {t("pages.login.form.sign_up")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
