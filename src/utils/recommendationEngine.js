// 推薦エンジン - 商品・コースの推薦アルゴリズム

// ユーザーの行動データに基づく推薦スコア計算
export const calculateRecommendationScore = (item, userProfile, userHistory) => {
  let score = 0;
  
  // 基本スコア（商品の人気度）
  score += (item.rating || 4.0) * 10;
  score += Math.min((item.sales || 0) / 100, 5) * 5;
  
  // カテゴリー嗜好スコア
  if (userProfile.preferredCategories && userProfile.preferredCategories.includes(item.category)) {
    score += 20;
  }
  
  // 価格帯スコア
  if (userProfile.averageSpending) {
    const priceRatio = item.price / userProfile.averageSpending;
    if (priceRatio >= 0.5 && priceRatio <= 2.0) {
      score += 15;
    }
  }
  
  // 購入履歴との関連性
  if (userHistory.purchasedItems) {
    const relatedItems = userHistory.purchasedItems.filter(purchased => 
      purchased.category === item.category || 
      purchased.tags?.some(tag => item.tags?.includes(tag))
    );
    score += relatedItems.length * 10;
  }
  
  // 最近の閲覧履歴
  if (userHistory.viewedItems) {
    const recentViews = userHistory.viewedItems.filter(viewed => 
      viewed.category === item.category &&
      Date.now() - new Date(viewed.viewedAt).getTime() < 7 * 24 * 60 * 60 * 1000 // 7日以内
    );
    score += recentViews.length * 5;
  }
  
  return Math.round(score);
};

// 協調フィルタリング（他のユーザーとの類似性）
export const collaborativeFiltering = (targetUser, allUsers, allItems) => {
  const recommendations = [];
  
  // 類似ユーザーを見つける
  const similarUsers = findSimilarUsers(targetUser, allUsers);
  
  // 類似ユーザーが購入した商品を推薦
  similarUsers.forEach(user => {
    user.purchasedItems?.forEach(item => {
      const alreadyPurchased = targetUser.purchasedItems?.some(p => p.id === item.id);
      if (!alreadyPurchased) {
        const existingRec = recommendations.find(r => r.id === item.id);
        if (existingRec) {
          existingRec.score += user.similarity * 10;
        } else {
          recommendations.push({
            ...item,
            score: user.similarity * 10,
            reason: 'similar_users'
          });
        }
      }
    });
  });
  
  return recommendations.sort((a, b) => b.score - a.score);
};

// ユーザー間の類似度計算
const findSimilarUsers = (targetUser, allUsers) => {
  return allUsers
    .filter(user => user.id !== targetUser.id)
    .map(user => ({
      ...user,
      similarity: calculateUserSimilarity(targetUser, user)
    }))
    .filter(user => user.similarity > 0.3)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10);
};

// ユーザー類似度計算
const calculateUserSimilarity = (user1, user2) => {
  let similarity = 0;
  let factors = 0;
  
  // カテゴリー嗜好の類似性
  if (user1.preferredCategories && user2.preferredCategories) {
    const commonCategories = user1.preferredCategories.filter(cat => 
      user2.preferredCategories.includes(cat)
    );
    similarity += (commonCategories.length / Math.max(user1.preferredCategories.length, user2.preferredCategories.length)) * 0.4;
    factors += 0.4;
  }
  
  // 価格帯の類似性
  if (user1.averageSpending && user2.averageSpending) {
    const priceDiff = Math.abs(user1.averageSpending - user2.averageSpending);
    const maxPrice = Math.max(user1.averageSpending, user2.averageSpending);
    similarity += (1 - priceDiff / maxPrice) * 0.3;
    factors += 0.3;
  }
  
  // 共通購入商品
  if (user1.purchasedItems && user2.purchasedItems) {
    const commonItems = user1.purchasedItems.filter(item1 => 
      user2.purchasedItems.some(item2 => item2.id === item1.id)
    );
    similarity += (commonItems.length / Math.max(user1.purchasedItems.length, user2.purchasedItems.length)) * 0.3;
    factors += 0.3;
  }
  
  return factors > 0 ? similarity / factors : 0;
};

// コンテンツベースフィルタリング
export const contentBasedFiltering = (item, allItems) => {
  return allItems
    .filter(otherItem => otherItem.id !== item.id)
    .map(otherItem => ({
      ...otherItem,
      similarity: calculateItemSimilarity(item, otherItem)
    }))
    .filter(item => item.similarity > 0.3)
    .sort((a, b) => b.similarity - a.similarity);
};

// 商品間の類似度計算
const calculateItemSimilarity = (item1, item2) => {
  let similarity = 0;
  let factors = 0;
  
  // カテゴリーの一致
  if (item1.category === item2.category) {
    similarity += 0.4;
  }
  factors += 0.4;
  
  // 価格帯の類似性
  const priceDiff = Math.abs(item1.price - item2.price);
  const avgPrice = (item1.price + item2.price) / 2;
  similarity += (1 - priceDiff / avgPrice) * 0.3;
  factors += 0.3;
  
  // タグの類似性
  if (item1.tags && item2.tags) {
    const commonTags = item1.tags.filter(tag => item2.tags.includes(tag));
    similarity += (commonTags.length / Math.max(item1.tags.length, item2.tags.length)) * 0.3;
  }
  factors += 0.3;
  
  return similarity / factors;
};

// 季節・トレンドベースの推薦
export const seasonalTrendRecommendations = (currentSeason, trendingItems) => {
  const seasonalItems = {
    spring: ['新鮮野菜', '春の食材', '軽やかな料理'],
    summer: ['冷たい料理', '夏野菜', 'BBQ用品'],
    autumn: ['秋の味覚', '煮込み料理', '季節の果物'],
    winter: ['温かい料理', '鍋料理', '冬の食材']
  };
  
  const seasonalKeywords = seasonalItems[currentSeason] || [];
  
  return trendingItems
    .filter(item => 
      seasonalKeywords.some(keyword => 
        item.name.includes(keyword) || 
        item.description.includes(keyword) ||
        item.tags?.includes(keyword)
      )
    )
    .map(item => ({
      ...item,
      reason: 'seasonal_trend'
    }));
};

// 新商品推薦
export const newProductRecommendations = (allItems, days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allItems
    .filter(item => new Date(item.createdAt) > cutoffDate)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(item => ({
      ...item,
      reason: 'new_product'
    }));
};

// 人気商品推薦
export const popularProductRecommendations = (allItems, limit = 10) => {
  return allItems
    .sort((a, b) => {
      const scoreA = (a.sales || 0) * 0.7 + (a.rating || 0) * 0.3;
      const scoreB = (b.sales || 0) * 0.7 + (b.rating || 0) * 0.3;
      return scoreB - scoreA;
    })
    .slice(0, limit)
    .map(item => ({
      ...item,
      reason: 'popular'
    }));
};

// 補完商品推薦（一緒に購入される商品）
export const complementaryProductRecommendations = (cartItems, purchaseHistory) => {
  const recommendations = [];
  
  cartItems.forEach(cartItem => {
    // 過去の購入履歴から、この商品と一緒に購入された商品を探す
    const relatedPurchases = purchaseHistory.filter(purchase => 
      purchase.items.some(item => item.id === cartItem.id)
    );
    
    relatedPurchases.forEach(purchase => {
      purchase.items.forEach(item => {
        if (item.id !== cartItem.id && !cartItems.some(c => c.id === item.id)) {
          const existing = recommendations.find(r => r.id === item.id);
          if (existing) {
            existing.frequency += 1;
          } else {
            recommendations.push({
              ...item,
              frequency: 1,
              reason: 'frequently_bought_together'
            });
          }
        }
      });
    });
  });
  
  return recommendations
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);
};

// 価格帯別推薦
export const priceBasedRecommendations = (userBudget, allItems) => {
  const budgetRange = {
    low: userBudget * 0.5,
    high: userBudget * 1.5
  };
  
  return allItems
    .filter(item => item.price >= budgetRange.low && item.price <= budgetRange.high)
    .sort((a, b) => {
      // 予算に近い商品を優先
      const distanceA = Math.abs(a.price - userBudget);
      const distanceB = Math.abs(b.price - userBudget);
      return distanceA - distanceB;
    })
    .map(item => ({
      ...item,
      reason: 'price_range'
    }));
};

// 統合推薦システム
export const generateRecommendations = (user, allItems, allUsers, options = {}) => {
  const {
    includeCollaborative = true,
    includeContentBased = true,
    includeSeasonal = true,
    includePopular = true,
    includeNew = true,
    limit = 20
  } = options;
  
  let recommendations = [];
  
  // 各推薦手法からの結果を統合
  if (includeCollaborative && user) {
    const collaborative = collaborativeFiltering(user, allUsers, allItems);
    recommendations = [...recommendations, ...collaborative.slice(0, 5)];
  }
  
  if (includePopular) {
    const popular = popularProductRecommendations(allItems, 5);
    recommendations = [...recommendations, ...popular];
  }
  
  if (includeNew) {
    const newProducts = newProductRecommendations(allItems, 30);
    recommendations = [...recommendations, ...newProducts.slice(0, 5)];
  }
  
  if (includeSeasonal) {
    const currentSeason = getCurrentSeason();
    const seasonal = seasonalTrendRecommendations(currentSeason, allItems);
    recommendations = [...recommendations, ...seasonal.slice(0, 3)];
  }
  
  // 重複を除去し、スコアで並び替え
  const uniqueRecommendations = recommendations.reduce((acc, item) => {
    const existing = acc.find(r => r.id === item.id);
    if (!existing) {
      acc.push(item);
    } else if (item.score > existing.score) {
      Object.assign(existing, item);
    }
    return acc;
  }, []);
  
  return uniqueRecommendations
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);
};

// 現在の季節を取得
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

// A/Bテスト用の推薦アルゴリズム
export const abTestRecommendations = (user, allItems, testGroup) => {
  switch (testGroup) {
    case 'A':
      // 人気商品重視
      return popularProductRecommendations(allItems, 10);
    case 'B':
      // 個人化重視
      return generateRecommendations(user, allItems, [], {
        includeCollaborative: true,
        includeContentBased: true,
        includePopular: false
      });
    default:
      return generateRecommendations(user, allItems, []);
  }
};