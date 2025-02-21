import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { 
  Image, 
  Send, 
  Heart, 
  MessageCircle, 
  Share2, 
  Edit2, 
  Trash2,
  Search,
  Hash,
  X,
  Filter,
  User,
  Plus,
  Camera,
  MessageSquare,
  ThumbsUp,
  FileImage,
  Settings,
  Calendar
} from "lucide-react";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const UserStats = ({ stats, user }) => (
  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-6 backdrop-blur-lg">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
        <User className="text-white" size={32} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{user?.name}</h2>
        <p className="text-gray-400">@{user?.username}</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-3">
          <FileImage className="text-blue-400" size={24} />
          <span className="text-white">Posts</span>
        </div>
        <span className="text-2xl font-bold text-white">{stats?.totalPosts || 0}</span>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-3">
          <ThumbsUp className="text-pink-400" size={24} />
          <span className="text-white">Likes</span>
        </div>
        <span className="text-2xl font-bold text-white">{stats?.totalLikes || 0}</span>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-green-400" size={24} />
          <span className="text-white">Comments</span>
        </div>
        <span className="text-2xl font-bold text-white">{stats?.totalComments || 0}</span>
      </div>
    </div>
  </div>
);

const ShareModal = ({ isOpen, onClose, post }) => {
  if (!post) return null;

  const shareUrl = `${window.location.origin}/post/${post._id}`;
  const title = post.caption;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1e293b] rounded-2xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Share Post</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={48} round />
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={48} round />
              </TwitterShareButton>

              <WhatsappShareButton url={shareUrl} title={title}>
                <WhatsappIcon size={48} round />
              </WhatsappShareButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PostCard = ({ post, onLike, onComment, onShare, onEdit, onDelete, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const isOwnPost = post.userId._id === currentUserId;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post._id, newComment);
      setNewComment("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-6 backdrop-blur-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-white font-medium">{post.userId.name}</h3>
            <p className="text-gray-400 text-sm">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        {isOwnPost && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(post)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-white">{post.caption}</p>
        {post.imageUrl && (
          <img
            src={`http://localhost:5000${post.imageUrl}`}
            alt="Post content"
            className="rounded-xl w-full object-cover max-h-96"
            loading="lazy"
          />
        )}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 ${
            post.likes.includes(currentUserId) ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
          } transition-colors`}
        >
          <Heart size={20} />
          <span>{post.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <MessageCircle size={20} />
          <span>{post.comments.length}</span>
        </button>

        <button
          onClick={() => onShare(post)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <Share2 size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>

            <div className="space-y-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{comment.userId.name}</h4>
                      <span className="text-gray-400 text-sm">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Social = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showUserPosts, setShowUserPosts] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [newPost, setNewPost] = useState({
    caption: "",
    tags: [],
    image: null
  });
  const fileInputRef = useRef();

  
  
const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
  
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
  
      if (selectedTag.trim()) {
        params.append('tag', selectedTag.trim());
      }
  
      if (showUserPosts && user?._id) {
        params.append('userId', user._id);
      }
  
      const response = await axios.get(
        `http://localhost:5000/api/posts?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data) {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        setUserStats(response.data.userStats || {
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [currentPage, searchTerm, selectedTag, showUserPosts, user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('caption', newPost.caption);
      formData.append('tags', JSON.stringify(newPost.tags));
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      if (editingPost) {
        await axios.put(`http://localhost:5000/api/posts/${editingPost._id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Post updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/posts', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Post created successfully');
      }

      setIsPostModalOpen(false);
      setEditingPost(null);
      setNewPost({ caption: "", tags: [], image: null });
      fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('Failed to submit post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { text: commentText },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId ? response.data.data : post
          )
        );
        toast.success('Comment added successfully');
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Post deleted successfully');
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4  md:p-8">
      <div className="max-w-7xl mx-auto mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <UserStats stats={userStats} user={user} />
          </div>

          <div className="md:col-span-3">
            <div className="mb-6 space-y-4">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus size={24} />
                Create New Post
              </button>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Filter by tag..."
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
  onClick={() => {
    setShowUserPosts(!showUserPosts);
    setCurrentPage(1);
  }}
  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
    showUserPosts 
      ? 'bg-blue-500 text-white' 
      : 'bg-white/10 text-gray-400 hover:bg-white/20'
  }`}
>
  <Filter size={20} />
  My Posts
</button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUserId={user._id}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={(post) => {
                      setSelectedPost(post);
                      setIsShareModalOpen(true);
                    }}
                    onEdit={(post) => {
                      setEditingPost(post);
                      setNewPost({
                        caption: post.caption,
                        tags: post.tags || [],
                        image: null
                      });
                      setIsPostModalOpen(true);
                    }}
                    onDelete={handleDeletePost}
                  />
                ))}

                {posts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No posts found</p>
                  </div>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isPostModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e293b] rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h2>
                <button
                  onClick={() => {
                    setIsPostModalOpen(false);
                    setEditingPost(null);
                    setNewPost({ caption: "", tags: [], image: null });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div>
                  <textarea
                    placeholder="What's on your mind?"
                    value={newPost.caption}
                    onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Add tags (comma separated)"
                    value={newPost.tags.join(', ')}
                    onChange={(e) => setNewPost(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    }))}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full p-3 bg-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/20 flex items-center justify-center gap-2"
                  >
                    <Image size={20} />
                    {newPost.image ? 'Change Image' : 'Add Image'}
                  </button>
                  {newPost.image && (
                    <p className="mt-2 text-sm text-gray-400">
                      Selected: {newPost.image.name}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
      />
    </div>
  );
};

export default Social;