import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlus, FiEdit, FiTrash2, FiEye, FiSave, FiX, FiImage, 
  FiCalendar, FiTag, FiUser, FiBarChart3, FiTrendingUp 
} = FiIcons;

const BlogAdmin = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = () => {
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    setPosts(savedPosts);
  };

  const handleCreatePost = () => {
    setEditingPost({
      id: Date.now(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Admin',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      category: 'recipes',
      tags: [],
      publishedAt: new Date().toISOString(),
      readTime: 5,
      views: 0,
      likes: 0,
      featured: false,
      image: '',
      status: 'draft'
    });
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleSavePost = (postData) => {
    const updatedPosts = editingPost.id ? 
      posts.map(p => p.id === editingPost.id ? postData : p) :
      [...posts, postData];
    
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId) => {
    if (confirm('この記事を削除しますか？')) {
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const PostEditor = ({ post, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      ...post,
      tags: post.tags.join(', ')
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const postData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        readTime: Math.ceil(formData.content.length / 1000) || 5,
        publishedAt: formData.status === 'published' ? 
          (post.publishedAt || new Date().toISOString()) : 
          formData.publishedAt
      };
      
      onSave(postData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {post.title ? '記事を編集' : '新しい記事を作成'}
              </h3>
              <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    記事タイトル *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      }));
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="魅力的なタイトルを入力..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    スラッグ
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="URL用のスラッグ"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    空欄の場合、タイトルから自動生成されます
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリー *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="recipes">レシピ</option>
                    <option value="techniques">技術・コツ</option>
                    <option value="equipment">調理器具</option>
                    <option value="ingredients">食材・栄養</option>
                    <option value="health">健康・美容</option>
                    <option value="international">世界の料理</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ステータス
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="draft">下書き</option>
                    <option value="published">公開</option>
                    <option value="archived">アーカイブ</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">注目記事として表示</label>
                </div>
              </div>

              {/* メディア・メタ情報 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    アイキャッチ画像URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="プレビュー"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    著者
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="著者名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タグ
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="タグ1, タグ2, タグ3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    カンマ区切りで複数のタグを入力
                  </p>
                </div>
              </div>
            </div>

            {/* 記事の概要 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                記事の概要 *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="記事の内容を簡潔に説明してください..."
              />
            </div>

            {/* 記事本文 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                記事本文 *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                placeholder="# 見出し1&#10;## 見出し2&#10;&#10;記事の内容をMarkdown形式で入力してください..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Markdown形式で記述してください。見出しは #、## を使用
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0)
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ブログ管理</h1>
          <p className="text-gray-600">記事の作成・編集・管理を行います</p>
        </motion.div>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-2 border-b-2 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              記事管理
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-2 border-b-2 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              分析
            </button>
          </nav>
        </div>

        {activeTab === 'posts' && (
          <>
            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">総記事数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <SafeIcon icon={FiEdit} className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">公開中</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <SafeIcon icon={FiEye} className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">下書き</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.draftPosts}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <SafeIcon icon={FiEdit} className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">総閲覧数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <SafeIcon icon={FiBarChart3} className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">総いいね数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* 記事管理 */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">記事一覧</h2>
                  <button
                    onClick={handleCreatePost}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    <span>新しい記事</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4">記事</th>
                      <th className="text-left p-4">ステータス</th>
                      <th className="text-left p-4">カテゴリー</th>
                      <th className="text-left p-4">閲覧数</th>
                      <th className="text-left p-4">いいね</th>
                      <th className="text-left p-4">公開日</th>
                      <th className="text-left p-4">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-16 h-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">
                                {post.title}
                              </p>
                              <p className="text-sm text-gray-600">{post.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800'
                              : post.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.status === 'published' ? '公開中' : 
                             post.status === 'draft' ? '下書き' : 'アーカイブ'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">{post.category}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-900">{post.views.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-900">{post.likes}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">
                            {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/blog/${post.slug}`)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <SafeIcon icon={FiEye} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditPost(post)}
                              className="text-orange-600 hover:text-orange-800"
                            >
                              <SafeIcon icon={FiEdit} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">人気記事</h3>
              <div className="space-y-4">
                {posts
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((post, index) => (
                    <div key={post.id} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{post.title}</p>
                        <p className="text-sm text-gray-600">{post.views.toLocaleString()} views</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 記事エディター */}
        {showEditor && (
          <PostEditor
            post={editingPost}
            onSave={handleSavePost}
            onCancel={() => {
              setShowEditor(false);
              setEditingPost(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BlogAdmin;