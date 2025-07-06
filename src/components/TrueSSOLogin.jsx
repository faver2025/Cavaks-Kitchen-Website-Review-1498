import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService, getSupabaseStatus } from '../lib/supabase';

const TrueSSOLogin = ({ setUser, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabaseの状況を確認
    const status = getSupabaseStatus();
    setSupabaseStatus(status);
    console.log('🔍 Supabase状況:', status);
  }, []);

  const handleLogin = async (provider) => {
    console.log(`🔄 ${provider}でログイン開始`);
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (provider === 'google') {
        result = await authService.signInWithGoogle();
      } else if (provider === 'github') {
        result = await authService.signInWithGitHub();
      } else {
        throw new Error(`未対応のプロバイダー: ${provider}`);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data?.user) {
        console.log('✅ ログイン成功:', result.data.user);
        setUser(result.data.user);
        
        if (onSuccess) onSuccess();
        
        // デモモードかどうかを表示
        if (result.data.user.demo) {
          console.log('🎯 デモモードでログイン');
        } else {
          console.log('🚀 本番モードでログイン');
        }
        
        navigate('/dashboard');
      } else {
        // OAuth リダイレクトの場合
        console.log('🔄 OAuth認証中...');
      }

    } catch (err) {
      console.error('❌ ログインエラー:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-6">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Cavak's Kitchenへようこそ
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ログインまたは新規登録
            </p>
          </div>

          {/* システム状況 */}
          {supabaseStatus && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">システム状況</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  supabaseStatus.mode === 'production' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {supabaseStatus.mode === 'production' ? '✅ 本番モード' : '🎯 デモモード'}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {supabaseStatus.mode === 'demo' && (
                  <p>💡 すべての機能をデモモードで体験できます</p>
                )}
                {supabaseStatus.mode === 'production' && (
                  <p>🚀 実際のデータベースに接続されています</p>
                )}
              </div>
            </div>
          )}

          {/* エラーメッセージ */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          {/* ログインボタン */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? '処理中...' : 'Googleでログイン'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin('github')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {loading ? '処理中...' : 'GitHubでログイン'}
            </motion.button>
          </div>

          {/* フッター */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrueSSOLogin;