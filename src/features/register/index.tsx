import { RegisterForm } from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex container mx-auto w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
