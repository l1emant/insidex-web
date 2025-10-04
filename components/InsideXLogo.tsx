import Link from "next/link";

interface InsideXLogoProps {
  className?: string;
  href?: string;
}

const InsideXLogo = ({ className = "", href = "/" }: InsideXLogoProps) => {
  const logoElement = (
    <div className={`flex items-center ${className}`}>
      <span className="text-xl font-semibold tracking-tight">
        InsideX
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export default InsideXLogo;
