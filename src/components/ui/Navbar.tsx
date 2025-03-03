'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const Navbar = () => {
  const pathName = usePathname();

// Function to check if the current path matches the link's path
const isActive = (path: string) => {
const currentPath = pathName.split('/')[1] // Get the first segment after /
return currentPath === path.replace('/', '');
};

  return (
    <nav className="font-serif  p-2 ">
      <div className="items-center flex">
        <ul className="inline-flex flex-row items-center mx-auto bg-[#1f1f1f] py-2.5 px-1 rounded-full border border-[#f7eee332] text-[#646464] text-[1.2rem] ">
          <li className="px-2">
            <Link href="/AI" target="_blank"  prefetch={true}>
              <Image src="https://utfs.io/f/orc4evzyNtrg2K2riNsBQGN8KriC9uPWHlnIoFkxOYgeDpE7" alt="logo" width={100} height={50} decoding="sync"  priority loading="eager"/>
            </Link>
          </li>


          <li className="px-2">
            <Link href="/Draw"  prefetch={true} target="_blank"    >
              <button
                className={`rounded-full px-4 py-3 ${isActive('/Draw') ? 'bg-[#FF5E00] text-[#f7eee3]' : ''
                  }`}
              >
                Draw
              </button>
            </Link>
          </li>

          <li className="px-2">
            <Link href="/" prefetch={true} rel="preload">
              <button
                className={`rounded-full px-4 py-3 ${!isActive('/') ? 'bg-[#FF5E00] text-[#0c0c0c]' : ''
                  }`}
              >
                Upload
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
