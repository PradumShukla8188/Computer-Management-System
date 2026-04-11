import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
    return (
        <Link href="/" className="flex items-center">
            <Image
                src="/images/logo/SST-logo.png"
                alt="logo"
                width={75}
                height={50}
                quality={100}
            />
        </Link>
    );
};

export default Logo;
