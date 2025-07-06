import { createClient } from '@supabase/supabase-js'

// Supabase認証情報を同期的に取得
const getSupabaseCredentials = () => {
  try {
    // 環境変数から取得を試行
    const envPatterns = [
      { url: 'VITE_SUPABASE_URL', key: 'VITE_SUPABASE_ANON_KEY' },
      { url: 'SUPABASE_URL', key: 'SUPABASE_ANON_KEY' },
      { url: 'REACT_APP_SUPABASE_URL', key: 'REACT_APP_SUPABASE_ANON_KEY' }
    ];

    for (const pattern of envPatterns) {
      const url = import.meta.env[pattern.url];
      const key = import.meta.env[pattern.key];
      
      if (url && key && url.startsWith('https://') && key.startsWith('eyJ')) {
        console.log('✅ 環境変数からSupabase認証情報を取得:', pattern.url);
        return { url, key };
      }
    }

    console.log('ℹ️ Supabase環境変数が見つかりません、デモモードで継続');
    return null;
  } catch (error) {
    console.error('❌ Supabase認証情報取得エラー:', error);
    return null;
  }
};

// Supabase認証情報を取得
const credentials = getSupabaseCredentials();

// Supabaseクライアントを作成
export const supabase = credentials 
  ? createClient(credentials.url, credentials.key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/#/dashboard`
      }
    })
  : null;

console.log('🔧 Supabase初期化:', supabase ? '✅ 本番モード' : '🎯 デモモード');

// 認証サービス
export const authService = {
  // セッション取得
  async getSession() {
    if (!supabase) {
      const demoUser = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('demoUser') || 'null')
        : null;
      return { data: { session: demoUser ? { user: demoUser } : null }, error: null };
    }
    
    try {
      return await supabase.auth.getSession();
    } catch (error) {
      console.error('Session取得エラー:', error);
      return { data: { session: null }, error };
    }
  },

  // Google OAuth ログイン
  async signInWithGoogle() {
    if (!supabase) {
      return this.createDemoUser('Google');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/dashboard`
        }
      });
      
      if (error) {
        console.log('Google OAuth失敗、デモモードにフォールバック');
        return this.createDemoUser('Google');
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Google OAuth エラー:', err);
      return this.createDemoUser('Google');
    }
  },

  // GitHub OAuth ログイン
  async signInWithGitHub() {
    if (!supabase) {
      return this.createDemoUser('GitHub');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/#/dashboard`
        }
      });
      
      if (error) {
        console.log('GitHub OAuth失敗、デモモードにフォールバック');
        return this.createDemoUser('GitHub');
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('GitHub OAuth エラー:', err);
      return this.createDemoUser('GitHub');
    }
  },

  // Email/Password ログイン
  async signInWithEmail(email, password) {
    if (!supabase) {
      if (!email || !password) {
        return { data: null, error: { message: 'メールアドレスとパスワードを入力してください' } };
      }
      return this.createDemoUser('Email');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return this.createDemoUser('Email');
      }
      
      return { data, error: null };
    } catch (err) {
      return this.createDemoUser('Email');
    }
  },

  // Email/Password サインアップ
  async signUpWithEmail(email, password, metadata = {}) {
    if (!supabase) {
      return this.createDemoUser('Email');
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        return this.createDemoUser('Email');
      }
      
      return { data, error: null };
    } catch (err) {
      return this.createDemoUser('Email');
    }
  },

  // サインアウト
  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demoUser');
    }
    
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('サインアウトエラー:', error);
      }
    }
    
    return { error: null };
  },

  // 認証状態変更監視
  onAuthStateChange(callback) {
    if (!supabase) {
      if (typeof window === 'undefined') {
        return { data: { subscription: { unsubscribe: () => {} } } };
      }

      const handleStorageChange = (e) => {
        if (e.key === 'demoUser') {
          const user = e.newValue ? JSON.parse(e.newValue) : null;
          callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', { user });
        }
      };

      window.addEventListener('storage', handleStorageChange);

      const savedUser = JSON.parse(localStorage.getItem('demoUser') || 'null');
      if (savedUser) {
        setTimeout(() => callback('SIGNED_IN', { user: savedUser }), 100);
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener('storage', handleStorageChange)
          }
        }
      };
    }

    return supabase.auth.onAuthStateChange(callback);
  },

  // デモユーザー作成
  async createDemoUser(provider) {
    const demoUser = {
      id: `demo_${Date.now()}`,
      email: `demo@${provider.toLowerCase()}.com`,
      name: `${provider} デモユーザー`,
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      provider: provider.toLowerCase(),
      demo: true,
      created_at: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ デモユーザー作成:', demoUser);
    return { data: { user: demoUser }, error: null };
  }
};

// データベース操作
export const dbOperations = {
  async getProducts() {
    if (!supabase) {
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem('adminProducts') || '[]');
    }
    
    try {
      const { data, error } = await supabase
        .from('products_ck2024')
        .select('*')
        .eq('status', 'active');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('商品取得エラー:', error);
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem('adminProducts') || '[]');
    }
  },

  async getCourses() {
    if (!supabase) {
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem('adminCourses') || '[]');
    }
    
    try {
      const { data, error } = await supabase
        .from('courses_ck2024')
        .select('*')
        .eq('status', 'published');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('コース取得エラー:', error);
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem('adminCourses') || '[]');
    }
  },

  async getOrders() {
    if (!supabase) {
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem('adminOrders') || '[]');
    }
    
    try {
      const { data, error } = await supabase
        .from('orders_ck2024')
        .select('*, order_items_ck2024(*)')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('注文取得エラー:', error);
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem('adminOrders') || '[]');
    }
  }
};

// システム状況取得
export const getSupabaseStatus = () => {
  return {
    connected: !!supabase,
    mode: supabase ? 'production' : 'demo',
    url: credentials?.url ? 'configured' : 'missing',
    key: credentials?.key ? 'configured' : 'missing',
    timestamp: new Date().toISOString()
  };
};

export default supabase;