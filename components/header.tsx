
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="py-2">
      <Link href="/">
        <h1>
          <a className="text-green-700">
            A NextJS & MDX Static Site
          </a>
        </h1>
      </Link>
    </header>
  );
};

export default Header;
