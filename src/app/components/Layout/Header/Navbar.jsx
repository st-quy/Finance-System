import { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import logo from "@assets/Images/logo.png";
import { Link } from "react-router-dom";

import { RiMenu2Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import { RiShoppingBagLine } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import { FiHeart, FiLogOut, FiUser } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

// social Links imports Icons

import Badge from "@mui/material/Badge";
import { useGetWishlist } from "@app/hooks/useWishlist";
import { useLogoutUser } from "@app/hooks/useAuth";
import { getStorageData } from "@app/configs/storage";
import { REFRESH_TOKEN } from "@app/constants/auth";

const Navbar = () => {
  const cart = useSelector((state) => state.cart);
  const { data: wishlistData } = useGetWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { mutate: logout } = useLogoutUser();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const role = useSelector((state) => state.auth.role);

  const isAdmin = role === "admin";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = mobileMenuOpen ? "auto" : "hidden";
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    const refreshToken = getStorageData(REFRESH_TOKEN);
    if (refreshToken) {
      logout(refreshToken);
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".relative")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showDropdown]);

  return (
    <>
      {/* Desktop Menu */}
      <nav className="hidden lg:flex items-center justify-between px-32 py-6 z-10 bg-white sticky top-0 shadow-[0_10px_33px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-center gap-[60px]">
          <div className="flex items-center justify-center">
            <Link to="/" onClick={scrollToTop}>
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
          </div>
          <div>
            <ul className="flex items-center gap-10">
              {["HOME", "SHOP", "BLOG", "ABOUT", "CONTACT"].map((item) => (
                <div key={item}>
                  <Link
                    to={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
                    onClick={scrollToTop}
                    className="!text-[#1b1b1b] text-sm font-semibold no-underline relative hover:after:w-[60%] after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-[#1b1b1b] after:transition-[width] after:duration-300 after:ease-out hover:after:delay-100"
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-center gap-9 text-center">
          <Link to="/cart" onClick={scrollToTop} className="text-black">
            <Badge
              badgeContent={cart.items.length === 0 ? "0" : cart.items.length}
              color="primary"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <RiShoppingBagLine size={22} />
            </Badge>
          </Link>
          <Link to="/wishlist" onClick={scrollToTop} className="text-black">
            <Badge
              badgeContent={wishlistData?.WishlistItems?.length || 0}
              color="primary"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <FiHeart size={22} className="cursor-pointer" />
            </Badge>
          </Link>
          <div className="relative top-0.5">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <FaRegUser size={18} />
            </div>

            {showDropdown && (
              <>
                {/* Overlay to handle click outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                {/* Dropdown menu */}
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-40 bg-white rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 ease-out">
                  <div className="py-2">
                    {isAuth ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => {
                            setShowDropdown(false);
                            scrollToTop();
                          }}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FiUser className="mr-3 text-gray-500" size={16} />
                          <span>Profile</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => {
                              setShowDropdown(false);
                              scrollToTop();
                            }}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <MdDashboard
                              className="mr-3 text-gray-500"
                              size={16}
                            />
                            <span>Admin Page</span>
                          </Link>
                        )}

                        <div
                          onClick={handleLogout}
                          className="w-full cursor-pointer flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="mr-3" size={16} />
                          <span>Logout</span>
                        </div>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => {
                          setShowDropdown(false);
                          scrollToTop();
                        }}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiUser className="mr-3 text-gray-500" size={16} />
                        <span>Login</span>
                      </Link>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <nav className="lg:hidden">
        <div className="flex items-center justify-between px-[60px] py-5 relative z-10 bg-white sm:px-[60px] xs:px-4">
          {mobileMenuOpen ? (
            <MdOutlineClose
              size={22}
              onClick={toggleMobileMenu}
              className="cursor-pointer"
            />
          ) : (
            <RiMenu2Line
              size={22}
              onClick={toggleMobileMenu}
              className="cursor-pointer"
            />
          )}
          <div className="flex items-center justify-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/cart">
              <Badge
                badgeContent={cart.items.length === 0 ? "0" : cart.items.length}
                color="primary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <RiShoppingBagLine size={22} className="text-black" />
              </Badge>
            </Link>
            <Link to="/wishlist">
              <Badge
                badgeContent={wishlistData?.WishlistItems?.length || 0}
                color="primary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <FiHeart size={22} className="text-black cursor-pointer" />
              </Badge>
            </Link>
            <div className="relative top-0.5">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <FaRegUser size={18} />
              </div>

              {showDropdown && (
                <>
                  {/* Overlay to handle click outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  {/* Dropdown menu */}
                  <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-40 bg-white rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 ease-out">
                    <div className="py-2">
                      {isAuth ? (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => {
                              setShowDropdown(false);
                              scrollToTop();
                            }}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiUser className="mr-3 text-gray-500" size={16} />
                            <span>Profile</span>
                          </Link>

                          {isAdmin && (
                            <Link
                              to="/admin/dashboard"
                              onClick={() => {
                                setShowDropdown(false);
                                scrollToTop();
                              }}
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <MdDashboard
                                className="mr-3 text-gray-500"
                                size={16}
                              />
                              <span>Admin Page</span>
                            </Link>
                          )}

                          <div
                            onClick={handleLogout}
                            className="w-full cursor-pointer flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FiLogOut className="mr-3" size={16} />
                            <span>Logout</span>
                          </div>
                        </>
                      ) : (
                        <Link
                          to="/login"
                          onClick={() => {
                            setShowDropdown(false);
                            scrollToTop();
                          }}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FiUser className="mr-3 text-gray-500" size={16} />
                          <span>Login</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col gap-[60px] h-screen bg-white absolute top-[74px] right-0 w-full shadow-md transition-transform duration-300 ease-out z-[9] border-t border-[#e4e4e4] ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full"
          }`}
        >
          <div className="p-5">
            <div>
              <ul className="list-none p-0 m-0 border-b border-[#e0e0e0]">
                {["HOME", "SHOP", "BLOG", "ABOUT", "CONTACT"].map((item) => (
                  <li key={item} className="px-5 py-2.5">
                    <Link
                      to={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
                      onClick={toggleMobileMenu}
                      className="no-underline text-[#1b1b1b] text-base font-semibold"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
