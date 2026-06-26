"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { FaCrown, FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Better Auth বা localStorage থেকে ইউজার ডাটা নেওয়া
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const features = [
    { feature: "Create Free Lessons", free: "✅ Unlimited", premium: "✅ Unlimited" },
    { feature: "Create Premium Lessons", free: "❌ No Access", premium: "✅ Unlimited" },
    { feature: "Ad-free Experience", free: "❌ No", premium: "✅ Yes" },
    { feature: "Priority Listing in Public Lessons", free: "❌ No", premium: "✅ High Priority" },
    { feature: "Access Premium Content", free: "❌ Blurred / Locked", premium: "✅ Full Access" },
    { feature: "Community Badge / Verified Status", free: "❌ None", premium: "⭐ Verified Premium" },
    { feature: "Profile Visibility Boost", free: "Normal", premium: "Highlighted" },
    { feature: "Lifetime Platform Access", free: "✅ Yes", premium: "✅ Yes" },
  ];

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please log in to upgrade your membership!");
      return router.push("/login");
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Invalid checkout URL");
      }
    } catch (err) {
      toast.error("Stripe Checkout initiation failed!");
    } finally {
      setLoading(false);
    }
  };

  // ইউজার অলরেডি প্রিমিয়াম হলে
  if (user?.isPremium) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 text-amber-400 text-3xl mb-4 animate-bounce">
          ⭐
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
          You are a Premium Member!
        </h1>
        <p className="text-slate-400 mt-2 max-w-xs text-sm">
          আপনার অ্যাকাউন্টে আজীবন প্রিমিয়াম লাইসেন্স সক্রিয় রয়েছে। সমস্ত ফিচার আনলকড!
        </p>
        <Button color="secondary" className="mt-6 bg-purple-600 font-semibold" onPress={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 md:px-10 relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">

        {/* Title & Subtitle */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
              <FaCrown className="text-[11px]" /> Premium Plan
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Upgrade Membership Plan
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto">
            Unlock premium life insights, create protected wisdom posts, and enjoy full community privileges.
          </p>
        </div>

        {/* 💡 কাস্টম Tailwind CSS ডার্ক টেবিল (এরর-ফ্রি এবং রেসপন্সিভ) */}
        <div className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-white/10">
                  <th className="p-4 text-slate-300 font-bold uppercase tracking-wider text-xs sm:text-sm">FEATURES</th>
                  <th className="p-4 text-slate-400 font-bold uppercase tracking-wider text-xs sm:text-sm">FREE PLAN</th>
                  <th className="p-4 text-purple-400 font-bold uppercase tracking-wider text-xs sm:text-sm">
                    PREMIUM <span className="text-xs text-amber-400 font-normal">(৳1500)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-300 text-sm sm:text-base">
                      {item.feature}
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {item.free}
                    </td>
                    <td className="p-4 text-purple-400 font-semibold text-sm">
                      {item.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button & Payment Guard Info */}
        <div className="text-center space-y-4 max-w-sm mx-auto">
          <Button
            size="lg"
            color="secondary"
            className="w-full font-bold bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all transform hover:scale-[1.01]"
            isLoading={loading}
            onClick={handleUpgrade}
            endContent={<FaCrown className="text-sm text-amber-300" />}
          >
            Upgrade to Premium – ৳1500 Lifetime
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <FaShieldAlt /> Secured payment processing via Stripe
          </div>
        </div>

      </div>
    </section>
  );
}