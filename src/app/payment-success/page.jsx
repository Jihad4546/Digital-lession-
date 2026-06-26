"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [email, setEmail] = useState("");

  useEffect(() => {
    // session_id না থাকলে কিছু করবো না
    if (!session_id) {
      setStatus("error");
      return;
    }

    // backend এ verify-payment কল করবো
    fetch(`http://localhost:8000/api/verify-payment?session_id=${session_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmail(data.email);
          setStatus("success"); // পেমেন্ট ভেরিফাইড, ইউজার প্রিমিয়াম হয়ে গেছে
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [session_id]);

  // লোডিং অবস্থায়
  if (status === "loading") {
    return <p className="text-purple-400 animate-pulse">Verifying payment...</p>;
  }

  // এরর অবস্থায়
  if (status === "error") {
    return (
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-red-500">Payment Failed ❌</h1>
        <p className="text-slate-400 text-sm">Something went wrong. Please contact support.</p>
        <button
          onClick={() => router.push("/pricing")}
          className="mt-4 px-6 py-2 bg-purple-600 rounded-lg text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  // সাকসেস অবস্থায়
  return (
    <div className="text-center space-y-3">
      <h1 className="text-3xl font-bold text-green-400">Payment Successful! 🎉</h1>
      <p className="text-slate-300">Welcome to Premium, <span className="text-purple-400">{email}</span></p>
      <p className="text-slate-400 text-sm">তুমি এখন সকল প্রিমিয়াম কন্টেন্ট অ্যাক্সেস করতে পারবে।</p>
      <button
        onClick={() => router.push("/dashboard/user")}
        className="mt-4 px-6 py-2 bg-green-600 rounded-lg text-white"
      >
        Go to Dashboard →
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <Suspense fallback={<p className="text-purple-400 animate-pulse">Loading...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}