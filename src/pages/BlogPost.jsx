import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiCalendar, FiUser, FiTag, FiClock, FiEye, FiHeart, 
  FiShare2, FiBookmark, FiArrowLeft, FiThumbsUp, FiMessageCircle,
  FiFacebook, FiTwitter, FiInstagram, FiCopy
} = FiIcons;

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPost();
    loadComments();
  }, [slug]);

  const loadBlogPost = () => {
    setLoading(true);
    
    // ブログ記事データを読み込み
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const foundPost = savedPosts.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // 閲覧数を増加
      const updatedPosts = savedPosts.map(p => 
        p.slug === slug ? { ...p, views: p.views + 1 } : p
      );
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      
      // 関連記事を取得
      const related = savedPosts
        .filter(p => 
          p.slug !== slug && 
          (p.category === foundPost.category || 
           p.tags.some(tag => foundPost.tags.includes(tag)))
        )
        .slice(0, 3);
      setRelatedPosts(related);
      
      // いいね・ブックマークの状態を確認
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      setLiked(likedPosts.includes(foundPost.id));
      setBookmarked(bookmarkedPosts.includes(foundPost.id));
    }
    
    setLoading(false);
  };

  const loadComments = () => {
    // コメントデータを読み込み
    const savedComments = JSON.parse(localStorage.getItem(`comments_${slug}`) || '[]');
    setComments(savedComments);
  };

  const handleLike = () => {
    if (!post) return;
    
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    let updatedLikedPosts;
    
    if (liked) {
      // いいねを取り消し
      updatedLikedPosts = likedPosts.filter(id => id !== post.id);
      setPost(prev => ({ ...prev, likes: prev.likes - 1 }));
    } else {
      // いいねを追加
      updatedLikedPosts = [...likedPosts, post.id];
      setPost(prev => ({ ...prev, likes: prev.likes + 1 }));
    }
    
    localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
    setLiked(!liked);
    
    // ブログ記事のいいね数を更新
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const updatedPosts = savedPosts.map(p => 
      p.id === post.id ? { ...p, likes: liked ? p.likes - 1 : p.likes + 1 } : p
    );
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleBookmark = () => {
    if (!post) return;
    
    const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    let updatedBookmarkedPosts;
    
    if (bookmarked) {
      updatedBookmarkedPosts = bookmarkedPosts.filter(id => id !== post.id);
    } else {
      updatedBookmarkedPosts = [...bookmarkedPosts, post.id];
    }
    
    localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarkedPosts));
    setBookmarked(!bookmarked);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('URLをコピーしました');
        break;
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: 'ゲストユーザー', // 実際の実装ではログインユーザー情報を使用
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${slug}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">記事を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">記事が見つかりません</h1>
          <Link
            to="/blog"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            ブログ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 戻るボタン */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
            ブログ一覧に戻る
          </Link>
        </motion.div>

        {/* 記事ヘッダー */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            
            <div className="absolute top-6 left-6">
              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
          </div>
          
          <div className="p-8">
            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                <span>{new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              <div className="flex items-center">
                <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                <span>約{post.readTime}分で読めます</span>
              </div>
              
              <div className="flex items-center">
                <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                <span>{post.views.toLocaleString()}回閲覧</span>
              </div>
            </div>
            
            {/* タイトル */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            {/* 著者情報 */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img
                  src={post.authorImage}
                  alt={post.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">プロシェフ</p>
                </div>
              </div>
              
              {/* アクションボタン */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    liked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <SafeIcon icon={FiHeart} className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarked
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <SafeIcon icon={FiBookmark} className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                
                <div className="relative group">
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <SafeIcon icon={FiShare2} className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="p-2">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 rounded"
                      >
                        <SafeIcon icon={FiFacebook} className="w-4 h-4 mr-2 text-blue-600" />
                        Facebookでシェア
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 rounded"
                      >
                        <SafeIcon icon={FiTwitter} className="w-4 h-4 mr-2 text-blue-400" />
                        Twitterでシェア
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 rounded"
                      >
                        <SafeIcon icon={FiCopy} className="w-4 h-4 mr-2 text-gray-600" />
                        URLをコピー
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* タグ */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  <SafeIcon icon={FiTag} className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>

        {/* 記事本文 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="prose prose-lg max-w-none">
            {/* Markdownコンテンツをレンダリング（簡易実装） */}
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/# (.*)/g, '<h1 class="text-2xl font-bold mb-4 mt-8">$1</h1>')
                  .replace(/## (.*)/g, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
                  .replace(/### (.*)/g, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
                  .replace(/\n\n/g, '</p><p class="mb-4">')
                  .replace(/^\d+\. (.*)/gm, '<li class="mb-2">$1</li>')
                  .replace(/^- (.*)/gm, '<li class="mb-2">$1</li>')
                  .replace(/<li/g, '<ol class="list-decimal list-inside mb-4"><li')
                  .replace(/li>/g, 'li></ol>')
              }}
            />
          </div>
        </motion.div>

        {/* コメントセクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <SafeIcon icon={FiMessageCircle} className="w-5 h-5 mr-2" />
            コメント ({comments.length})
          </h3>
          
          {/* コメント投稿フォーム */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="この記事についてコメントを書く..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                コメントを投稿
              </button>
            </div>
          </form>
          
          {/* コメント一覧 */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                        <SafeIcon icon={FiThumbsUp} className="w-4 h-4" />
                        <span>いいね ({comment.likes})</span>
                      </button>
                      
                      <button className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                        返信
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">まだコメントがありません。最初のコメントを投稿してみませんか？</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 関連記事 */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">関連記事</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {relatedPost.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                        <span>{new Date(relatedPost.publishedAt).toLocaleDateString('ja-JP')}</span>
                        <span className="mx-2">•</span>
                        <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                        <span>{relatedPost.readTime}分</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;