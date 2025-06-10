import { HeartPulse } from "lucide-react";

const Footer = () => {
  return (
    <>
      {" "}
      <footer className="bg-gray-950 text-gray-300 py-10">
        <div className="container mx-auto px-4 text-center space-y-3">
          <div className="flex justify-center items-center gap-2">
            <HeartPulse className="h-5 w-5 text-red-500" />
            <span className="text-lg font-semibold">VitalScope</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} VitalScope Inc. | Empowering proactive
            health intelligence
          </p>
        </div>
      </footer>
    </>
  );
};
export default Footer;
