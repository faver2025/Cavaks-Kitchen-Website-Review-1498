import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUser, FiTag, FiClock, FiEye, FiHeart, FiSearch, FiFilter } = FiIcons;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = () => {
    setLoading(true);
    
    // ブログ記事のデータを読み込み
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    if (savedPosts.length === 0) {
      // 初期ブログ記事データ
      const defaultPosts = [
        {
          id: 1,
          title: '基本のだしの取り方 - 和食の基礎をマスターしよう',
          slug: 'basic-dashi-making',
          excerpt: '美味しい和食の基本となる「だし」の取り方を詳しく解説します。昆布だし、かつおだし、合わせだしの違いと使い分けを学びましょう。',
          content: `# 基本のだしの取り方

美味しい和食を作るための基本となる「だし」について詳しく解説します。

## 昆布だしの取り方

### 材料
- 昆布 10g
- 水 1L

### 手順
1. 昆布の表面を固く絞った布巾で軽く拭く
2. 鍋に水と昆布を入れ、30分以上置く
3. 弱火にかけ、沸騰直前で昆布を取り出す

## かつおだしの取り方

### 材料
- かつお節 20g
- 水 1L

### 手順
1. 水を沸騰させる
2. かつお節を入れ、1-2分煮立てる
3. ザルにキッチンペーパーを敷いて濾す

## 合わせだし

昆布だしとかつおだしを合わせることで、より深い味わいのだしが完成します。`,
          author: 'Chef 田中',
          authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          category: 'techniques',
          tags: ['だし', '和食', '基本技術', '昆布', 'かつお節'],
          publishedAt: '2024-01-15T09:00:00Z',
          readTime: 8,
          views: 1250,
          likes: 89,
          featured: true,
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          status: 'published'
        },
        {
          id: 2,
          title: '季節の野菜を活かした春のレシピ集',
          slug: 'spring-vegetable-recipes',
          excerpt: '春キャベツ、新玉ねぎ、アスパラガスなど、春の旬野菜を使った美味しいレシピをご紹介。栄養価も高く、彩り豊かな料理で食卓を華やかに。',
          content: `# 季節の野菜を活かした春のレシピ集

春の訪れとともに、新鮮で美味しい春野菜が店頭に並び始めます。

## 春キャベツのメンチカツ

### 材料（4人分）
- 春キャベツ 1/4個
- 合いびき肉 300g
- 玉ねぎ 1/2個
- パン粉、小麦粉、卵 適量

### 作り方
1. 春キャベツは粗みじん切りにする
2. 玉ねぎはみじん切りにして炒める
3. ひき肉と野菜を混ぜ、成形する
4. パン粉をつけて揚げる

## アスパラガスのグリル

### 材料
- アスパラガス 1束
- オリーブオイル 大さじ2
- 塩、胡椒 適量
- レモン汁 適量

### 作り方
1. アスパラガスの根元を切り落とす
2. オリーブオイルと調味料で和える
3. グリルで焼き色がつくまで焼く`,
          author: 'Chef 佐藤',
          authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          category: 'recipes',
          tags: ['春野菜', 'レシピ', '季節料理', 'ヘルシー'],
          publishedAt: '2024-01-12T14:30:00Z',
          readTime: 12,
          views: 890,
          likes: 67,
          featured: false,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          status: 'published'
        },
        {
          id: 3,
          title: 'プロが教える包丁の選び方とお手入れ方法',
          slug: 'knife-selection-and-care',
          excerpt: '料理の基本となる包丁の選び方から、長持ちさせるためのお手入れ方法まで、プロの料理人が詳しく解説します。',
          content: `# プロが教える包丁の選び方とお手入れ方法

良い包丁は料理の質を大きく左右します。

## 包丁の種類と用途

### 三徳包丁
- 最も汎用性が高い
- 肉、魚、野菜すべてに対応
- 初心者におすすめ

### ペティナイフ
- 細かい作業に最適
- 果物の皮むきや飾り切り
- セカンドナイフとして

### 出刃包丁
- 魚をさばく専用
- 厚みがあり重い
- 骨を断つことができる

## お手入れ方法

### 使用後のお手入れ
1. 使用後すぐに洗う
2. 中性洗剤で優しく洗う
3. 水分を完全に拭き取る
4. 風通しの良い場所で乾燥

### 研ぎ方
1. 砥石を水に浸す
2. 角度を一定に保つ
3. 軽い力で往復させる
4. 裏面も同様に研ぐ`,
          author: 'Chef 山田',
          authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          category: 'equipment',
          tags: ['包丁', '調理器具', 'メンテナンス', 'プロの技術'],
          publishedAt: '2024-01-10T11:15:00Z',
          readTime: 15,
          views: 1450,
          likes: 134,
          featured: true,
          image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          status: 'published'
        },
        {
          id: 4,
          title: '発酵食品の魅力と家庭での作り方',
          slug: 'fermented-foods-guide',
          excerpt: '健康にも美容にも良いとされる発酵食品。味噌、醤油、納豆などの日本の伝統的な発酵食品から、最近話題のコンブチャまで幅広くご紹介。',
          content: `# 発酵食品の魅力と家庭での作り方

発酵食品は健康と美味しさを両立する素晴らしい食材です。

## 発酵食品のメリット

### 健康効果
- 腸内環境の改善
- 免疫力の向上
- 栄養価の向上
- 消化の促進

### 美味しさの向上
- うま味の増加
- 独特の風味
- 保存性の向上

## 家庭で作れる発酵食品

### 塩麹
#### 材料
- 米麹 200g
- 塩 60g
- 水 300ml

#### 作り方
1. 麹と塩を混ぜる
2. 水を少しずつ加える
3. 1週間常温で発酵させる

### ザワークラウト
#### 材料
- キャベツ 1kg
- 塩 20g

#### 作り方
1. キャベツを千切りにする
2. 塩を加えて揉む
3. 重しをして1週間発酵

## 発酵食品を使ったレシピ

### 塩麹チキン
1. 鶏肉に塩麹を塗る
2. 一晩漬け込む
3. フライパンで焼く`,
          author: 'Chef 鈴木',
          authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          category: 'health',
          tags: ['発酵食品', '健康', '腸活', '手作り', '伝統食'],
          publishedAt: '2024-01-08T16:45:00Z',
          readTime: 10,
          views: 720,
          likes: 56,
          featured: false,
          image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          status: 'published'
        },
        {
          id: 5,
          title: 'イタリア料理の基本 - 本格パスタの茹で方とソース作り',
          slug: 'authentic-italian-pasta',
          excerpt: 'イタリア料理の代表格、パスタ。アルデンテに茹でる秘訣から、基本的なトマトソース、クリームソースの作り方まで詳しく解説します。',
          content: `# イタリア料理の基本 - 本格パスタの茹で方とソース作り

本格的なイタリアンを家庭で楽しむためのテクニックをお教えします。

## パスタの茹で方

### アルデンテとは
- 歯ごたえが残る状態
- 中心に芯が少し残る程度
- パッケージ表示より1分短く

### 茹で方のコツ
1. たっぷりの湯を沸かす（パスタ100gに対して1L）
2. 塩を加える（湯の1%）
3. パスタを入れて混ぜる
4. 表示時間より1分短く茹でる

## 基本のトマトソース

### 材料
- ホールトマト 400g
- にんにく 2片
- オリーブオイル 大さじ3
- 塩、胡椒 適量
- バジル 数枚

### 作り方
1. にんにくをオリーブオイルで炒める
2. トマトを加えて煮込む
3. 塩胡椒で味を調える
4. バジルを加える

## カルボナーラ

### 本格レシピ
1. パンチェッタを炒める
2. 卵黄とチーズを混ぜる
3. 茹でたパスタと和える
4. 火を止めて卵液を加える`,
          author: 'Chef ロッシ',
          authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          category: 'international',
          tags: ['イタリア料理', 'パスタ', 'ソース', '本格レシピ'],
          publishedAt: '2024-01-05T13:20:00Z',
          readTime: 14,
          views: 1680,
          likes: 142,
          featured: true,
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          status: 'published'
        }
      ];
      
      setPosts(defaultPosts);
      localStorage.setItem('blogPosts', JSON.stringify(defaultPosts));
    } else {
      // 公開されている記事のみ表示
      setPosts(savedPosts.filter(post => post.status === 'published'));
    }
    
    // カテゴリーデータ
    const blogCategories = [
      { id: 'all', name: 'すべて', count: 0 },
      { id: 'recipes', name: 'レシピ', count: 0 },
      { id: 'techniques', name: '技術・コツ', count: 0 },
      { id: 'equipment', name: '調理器具', count: 0 },
      { id: 'ingredients', name: '食材・栄養', count: 0 },
      { id: 'health', name: '健康・美容', count: 0 },
      { id: 'international', name: '世界の料理', count: 0 }
    ];
    
    setCategories(blogCategories);
    setLoading(false);
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'popular':
          return b.views - a.views;
        case 'liked':
          return b.likes - a.likes;
        default:
          return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });

  const featuredPosts = posts.filter(post => post.featured).slice(0, 3);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ブログを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cavak's Kitchen ブログ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            料理のコツから食材の知識まで、美味しい料理を作るための情報をお届けします
          </p>
        </motion.div>

        {/* 注目記事 */}
        {featuredPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">注目の記事</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        注目
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3 text-sm text-gray-500">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                      <span>{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</span>
                      <span className="mx-2">•</span>
                      <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                      <span>{post.readTime}分</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={post.authorImage}
                          alt={post.author}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                      
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                      >
                        続きを読む →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 検索・フィルター */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* 検索 */}
            <div className="relative flex-1">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* ソート */}
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="text-gray-500 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="latest">最新順</option>
                <option value="popular">人気順</option>
                <option value="liked">いいね順</option>
              </select>
            </div>
          </div>
          
          {/* カテゴリーフィルター */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 記事一覧 */}
        <motion.div
          key={activeCategory + searchTerm}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {categories.find(c => c.id === post.category)?.name || post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-3 text-sm text-gray-500">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</span>
                  <span className="mx-2">•</span>
                  <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                  <span>{post.readTime}分</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* タグ */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      <SafeIcon icon={FiTag} className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-600">{post.author}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center">
                      <SafeIcon icon={FiHeart} className="w-4 h-4 mr-1" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* 検索結果がない場合 */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">記事が見つかりませんでした</h3>
            <p className="text-gray-600 mb-6">
              検索条件を変更するか、カテゴリーを選び直してください。
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              すべての記事を表示
            </button>
          </motion.div>
        )}

        {/* ページネーション */}
        {filteredPosts.length > 12 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex justify-center"
          >
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                前へ
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                次へ
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;