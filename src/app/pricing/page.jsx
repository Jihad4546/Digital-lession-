"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@heroui/react";

export default function PricingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const features = [
    {
      feature: "Create Lessons",
      free: "5 per month",
      premium: "Unlimited",
    },
    {
      feature: "Ad-free Experience",
      free: "❌",
      premium: "✔",
    },
    {
      feature: "Priority Listing",
      free: "❌",
      premium: "✔",
    },
    {
      feature: "Premium Content Access",
      free: "Limited",
      premium: "Full Access",
    },
    {
      feature: "Community Badge",
      free: "❌",
      premium: "Verified ⭐",
    },
    {
      feature: "Profile Boost",
      free: "Normal",
      premium: "Highlighted",
    },
  ];

  const handleUpgrade = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
      {
        method: "POST",
      }
    );

    const data = await res.json();
    window.location.href = data.url;
  };

  // If user already premium
  if (user?.isPremium) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-yellow-500">
          You are already a Premium ⭐ user
        </h1>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Upgrade to Premium
        </h1>

        {/* Table */}
        <Card className="p-6">
          <div className="grid grid-cols-3 font-semibold border-b pb-3">
            <div>Feature</div>
            <div>Free</div>
            <div>Premium</div>
          </div>

          {features.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-3 py-3 border-b text-sm"
            >
              <div>{item.feature}</div>
              <div>{item.free}</div>
              <div className="text-primary font-medium">
                {item.premium}
              </div>
            </div>
          ))}
        </Card>

        {/* Button */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            color="primary"
            onClick={handleUpgrade}
          >
            Upgrade to Premium – ৳1500 Lifetime
          </Button>
        </div>

      </div>
    </section>
  );
}