import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

export function AuthControls() {
  const { isSignedIn } = useUser();
  const { t } = useTranslation();

  if (isSignedIn) {
    return (
      <div className="auth-controls signed-in">
        <UserButton />
      </div>
    );
  }

  return (
    <div className="auth-controls signed-out">
      <SignInButton mode="modal">
        <button className="auth-btn" type="button">{t("perfil.signIn")}</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="auth-btn secondary" type="button">{t("perfil.signUp")}</button>
      </SignUpButton>
    </div>
  );
}