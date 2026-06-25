"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Spinner, Avatar, Card } from "@heroui/react";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaFlag, FaShareAlt, FaComment, FaCalendarAlt, FaBrain } from "react-icons/fa";
import toast from "react-hot-toast";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export default function LessonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const lessonId = params.id;

  // States
  const [lesson, setLesson] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Interaction States
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [viewsCount] = useState(Math.floor(Math.random() * 8000) + 1500);

  // Popups States
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);

  // ─── 1. FETCH ALL DATA ────────────────────────────────────────
  useEffect(() => {
    if (!lessonId) return;

    const fetchAllData = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}`);
        if (!res.ok) throw new Error("Lesson not found");
        const data = await res.json();
        setLesson(data);
        setLikesCount(data.likesCount || 0);
        setFavoritesCount(data.favoritesCount || 0);

        if (session?.user?.id) {
          if (data.likes) setIsLiked(data.likes.includes(session.user.id));
          if (data.favorites) setIsSaved(data.favorites.includes(session.user.id));
        }

        // Fetch recommendations based on category (Limit to 6 cards max)
        const recRes = await fetch(`${SERVER_URL}/api/lessons?category=${data.category}`);
        if (recRes.ok) {
          const recData = await recRes.json();
          // Filter out current lesson
          const filteredRec = recData.filter(item => item._id !== lessonId);
          setRecommended(filteredRec.slice(0, 6));
        }

        // Comments Fetch - DB suggestions alignment
        const commentRes = await fetch(`${SERVER_URL}/api/comments/${lessonId}`);
        if (commentRes.ok) setComments(await commentRes.json());

      } catch (err) {
        toast.error("Failed to load details");
        router.push("/public-lessons");
      } finally {                
        setLoading(false);
      }
    };

    fetchAllData();
  }, [lessonId, session, router]);

  // ─── 2. LIKE LOGIC ────────────────────────────────────────────
  const handleLikeToggle = async () => {
    if (!session?.user) {
      toast.error("Please log in to like");
      return router.push("/login"); 
    }

    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to update like status");
    }
  };

  // ─── 3. FAVORITE/SAVE LOGIC ───────────────────────────────────
  const handleFavoriteToggle = async () => {
    if (!session?.user) return toast.error("Please log in to save favorites");

    const prevSaved = isSaved;
    const prevFavCount = favoritesCount;

    setIsSaved(!isSaved);
    setFavoritesCount(prev => isSaved ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      if (!res.ok) throw new Error();
      toast.success(isSaved ? "Removed from favorites" : "Saved to favorites! 🔖");
    } catch {
      setIsSaved(prevSaved);
      setFavoritesCount(prevFavCount);
      toast.error("Failed to update favorite status");
    }
  };

  // ─── 4. COMMENT SUBMIT LOGIC ──────────────────────────────────
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) return toast.error("Please login to comment");
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const commentData = {
        lessonId,
        userId: session.user.id,
        userName: session.user.name || "Anonymous",
        userImage: session.user.image || "",
        text: newComment,
      };

      const res = await fetch(`${SERVER_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });

      if (res.ok) {
        const result = await res.json();
        // রিয়েল-টাইম কমেন্ট লিস্টে পুশ করা (লেটেস্ট কমেন্ট সবার আগে থাকবে)
        const mockSavedComment = {
          _id: result.insertedId || Date.now().toString(),
          ...commentData,
          createdAt: new Date()
        };
        setComments([mockSavedComment, ...comments]);
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch {
      toast.error("Could not post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  // ─── 5. REPORT SUBMIT LOGIC ───────────────────────────────────
  const handleReportSubmit = async () => {
    if (!session?.user) return toast.error("Please login first");
    if (!reportReason) return toast.error("Please select a reason");

    try {
      const res = await fetch(`${SERVER_URL}/api/lessons/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          reportedUserEmail: lesson.creatorEmail || "unknown@mail.com",
          reporterUserId: session.user.id,
          reason: reportReason,
          timestamp: new Date()
        }),
      });

      if (res.ok) {
        toast.success("Lesson reported successfully! 🚩");
        setReportModalOpen(false);
        setReportReason("");
      }
    } catch {
      toast.error("Failed to submit report");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPremiumLesson = lesson?.accessLevel === "Premium";
  const isUserPremium = session?.user?.plan === "premium" || session?.user?.isPremium === true || session?.user?.role === "admin";
  const isOwner = session?.user?.email === lesson?.creatorEmail;
  
  // গুরুত্বপূর্ণ ফিক্স: যদি প্রিমিয়াম লেসন হয়, ভিউয়ার প্রিমিয়াম না হয় এবং সে এই লেসনের মালিকও না হয় — তখনই আটকে দেওয়া হবে
  const accessDenied = isPremiumLesson && !isUserPremium && !isOwner;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 md:px-8 relative">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* 1. Lesson Information Section */}
        <div className="border-b border-white/5 pb-6">
          <div className="flex gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FaBrain className="text-[10px]" /> {lesson.category}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              🎭 {lesson.emotionalTone}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4 leading-tight">
            {lesson.title}
          </h1>

          {/* Featured Image */}
          {lesson.featuredImage && (
            <div className="w-full h-64 md:h-96 relative rounded-2xl overflow-hidden my-4 border border-white/5 shadow-inner">
              <img src={lesson.featuredImage} alt={lesson.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Premium Lock Handler */}
        <div className="relative min-h-[100px]">
          {accessDenied ? (
            <>
              <div className="select-none blur-md opacity-20 space-y-4 pointer-events-none text-justify text-lg leading-relaxed">
                <p>This is a premium insight. Upgrade your plan to see the full analysis, story details, and takeaways from this mentor.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum rem ipsam error aspernatur quasi.</p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-6 rounded-2xl">
                <div className="text-5xl mb-3 animate-bounce">👑</div>
                <h3 className="text-2xl font-bold text-amber-400">Premium Content Locked</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-2 mb-6">Upgrade to Premium to read full story insights.</p>
                <Button color="warning" className="font-bold px-8 shadow-lg bg-amber-500 text-slate-950" onPress={() => router.push("/pricing")}>
                  Upgrade Membership ✦
                </Button>
              </div>
            </>
          ) : (
            <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-line text-justify">{lesson.description}</div>
          )}
        </div>

        {!accessDenied && (
          <>
            {/* 2. Lesson Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/40 p-4 rounded-xl border border-white/5 text-xs text-slate-400">
              <div className="flex items-center gap-1">📅 Published: <b className="text-white">{new Date(lesson.createdAt).toLocaleDateString('en-GB')}</b></div>
              <div>🔄 Updated: <b className="text-white">{new Date(lesson.updatedAt || lesson.createdAt).toLocaleDateString('en-GB')}</b></div>
              <div>👁️ Views: <b className="text-white">{viewsCount}</b></div>
              <div>🔒 Visibility: <b className="text-white">{lesson.visibility || "Public"}</b></div>
            </div>

            {/* 4 & 5. Interaction Buttons & Stats */}
            <div className="flex justify-between items-center border-t border-b border-white/5 py-4">
              <div className="flex gap-6">
                <button onClick={handleLikeToggle} className="flex items-center gap-2 hover:text-rose-400 transition-colors group">
                  {isLiked ? <FaHeart className="text-rose-500 text-xl scale-110" /> : <FaRegHeart className="text-xl group-hover:scale-110 transition-transform" />}
                  <span className="text-sm font-medium">{likesCount} Likes</span>
                </button>
                <button onClick={handleFavoriteToggle} className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                  {isSaved ? <FaBookmark className="text-blue-500 text-xl scale-110" /> : <FaRegBookmark className="text-xl group-hover:scale-110 transition-transform" />}
                  <span className="text-sm font-medium">{favoritesCount} Favorites</span>
                </button>
                <div className="relative">
                  <button onClick={() => setShareDropdownOpen(!shareDropdownOpen)} className="flex items-center gap-2 hover:text-green-400 transition-colors">
                    <FaShareAlt className="text-xl" /> <span className="text-sm font-medium">Share</span>
                  </button>
                  {shareDropdownOpen && (
                    <div className="absolute top-9 left-0 bg-slate-900 border border-white/10 p-2 rounded-lg text-xs z-30 flex flex-col w-32 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                      <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link Copied!"); setShareDropdownOpen(false); }} className="hover:bg-white/5 p-2 text-left rounded-md transition-colors">🔗 Copy Link</button>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setReportModalOpen(true)} className="text-sm text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                <FaFlag size={12} /> Report
              </button>
            </div>

            {/* 3. Author Card */}
            <Card className="p-4 bg-slate-900/40 border border-white/5 text-white flex flex-row items-center gap-4 shadow-md backdrop-blur-sm">
              <Avatar src={lesson.creatorImage || ""} name={lesson.creatorName || "Author"} size="lg" className="border border-white/10" />
              <div className="flex-1">
                <h4 className="font-bold text-base text-slate-200">{lesson.creatorName || "Anonymous Learner"}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><FaCalendarAlt size={10} /> Created insights safely</p>
              </div>
              <Button size="sm" variant="bordered" className="text-xs text-slate-300 border-white/10 hover:bg-white/5" onClick={() => router.push(`/dashboard/user/profile`)}>
                View All Lessons
              </Button>
            </Card>

            {/* 6. Comment Section */}
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
                <FaComment className="text-purple-400" /> Discussion ({comments.length})
              </h3>

              {session?.user ? (
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <textarea
                    placeholder="Share your thoughts on this lesson..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-slate-900/30 border border-white/10 hover:border-white/20 focus:border-purple-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-slate-100 resize-none"
                  />
                  <Button type="submit" color="secondary" size="sm" className="bg-purple-600 font-semibold" isLoading={submittingComment}>Post Comment</Button>
                </form>
              ) : (
                <p className="text-sm text-amber-400 bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">⚠️ Please log in to join the conversation.</p>
              )}

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-500">No comments yet. Start the conversation!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="p-4 bg-slate-900/20 border border-white/5 rounded-xl flex gap-3 shadow-sm hover:border-white/10 transition-colors animate-in fade-in duration-300">
                      <Avatar src={comment.userImage} size="sm" className="border border-white/5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-purple-400">{comment.userName}</span>
                          <span className="text-[10px] text-slate-500">{new Date(comment.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 7. Recommendations */}
            {recommended.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-white/5">
                <h3 className="text-xl font-bold text-purple-400">📖 Recommended Lessons</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommended.map(item => (
                    <div 
                      key={item._id} 
                      onClick={() => router.push(`/lessons/${item._id}`)} 
                      className="p-5 bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 rounded-xl cursor-pointer transition-all hover:scale-[1.01] hover:border-purple-500/20 group"
                    >
                      <h5 className="font-bold text-sm text-slate-200 line-clamp-1 mb-2 group-hover:text-purple-400 transition-colors">{item.title}</h5>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">🚩 Report Lesson</h3>
            <p className="text-xs text-slate-400">Please provide a valid reason for reporting this insight.</p>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 pl-1">Select Reason</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-purple-500 rounded-xl px-3 py-2.5 text-sm outline-none transition-all text-slate-200 cursor-pointer"
              >
                <option value="" disabled>Choose a reason...</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Plagiarism / Copied">Plagiarism / Copied</option>
                <option value="Misleading Information">Misleading Information</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="flat" className="bg-slate-800 text-white font-medium" onClick={() => setReportModalOpen(false)}>Cancel</Button>
              <Button size="sm" color="danger" className="bg-red-600 font-medium" onClick={handleReportSubmit}>Submit Report</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}